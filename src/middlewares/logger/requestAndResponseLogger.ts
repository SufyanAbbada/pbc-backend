import winston from "winston";
import { Request, Response, NextFunction } from "express";
import { requestOrResponseBody } from "../../common/types";

type formatDataType =
  | Buffer
  | string
  | object
  | number
  | boolean
  | null
  | undefined;

const omittedLogFields = new Set(["role", "roles", "permissions"]);
const sensitiveLogFields = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "token",
]);

const sanitizeDataForLogging = (data: formatDataType): formatDataType => {
  if (!data || typeof data !== "object" || Buffer.isBuffer(data)) return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDataForLogging(item));
  }

  return Object.entries(data).reduce<Record<string, unknown>>(
    (sanitizedData, [key, value]) => {
      const normalizedKey = key.toLowerCase();

      if (omittedLogFields.has(normalizedKey)) {
        sanitizedData[key] = "[OMITTED FROM LOGS]";
      } else if (sensitiveLogFields.has(normalizedKey)) {
        sanitizedData[key] = "[REDACTED]";
      } else {
        sanitizedData[key] = sanitizeDataForLogging(value);
      }

      return sanitizedData;
    },
    {},
  );
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `\n\n${message}`;
        }),
      ),
    }),
  ],
});

const formatData = (data: formatDataType): string => {
  if (!data) return "— no data —";

  try {
    if (Buffer.isBuffer(data)) {
      return `<Buffer: ${data.length} bytes>`;
    }

    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return data.length > 1000 ? data.substring(0, 1000) + "..." : data;
      }
    }

    if (typeof data === "object") {
      return JSON.stringify(data, null, 2);
    }

    return String(data);
  } catch (error) {
    return `<Unformattable data: ${typeof data}>`;
  }
};

const requestAndResponseLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  const originalJson = res.json;

  (
    req as Request & { originalRequestBody: requestOrResponseBody }
  ).originalRequestBody = JSON.parse(JSON.stringify(req.body));

  let responseBody: requestOrResponseBody;
  let responseHandled = false;

  res.json = function (body: requestOrResponseBody): Response {
    responseBody = body;
    responseHandled = true;
    return originalJson.call(this, body);
  };

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    let requestBody = "— no body —";

    const originalRequestBody = (
      req as Request & { originalRequestBody: requestOrResponseBody }
    ).originalRequestBody;

    if (originalRequestBody) {
      if (Array.isArray(originalRequestBody)) {
        requestBody = `Array with ${originalRequestBody.length} items:\n${formatData(sanitizeDataForLogging(originalRequestBody))}`;
      } else if (Object.keys(originalRequestBody).length) {
        requestBody = formatData(sanitizeDataForLogging(originalRequestBody));
      }
    }

    const formattedResponse = formatData(sanitizeDataForLogging(responseBody));

    logger.info(
      `
[Request]:

🔹 Method: ${req.method}
🔹 URL: ${req.originalUrl}
🔹 Headers:\n${formatData(sanitizeDataForLogging(req.headers))}
🔹 Query:\n${formatData(sanitizeDataForLogging(req.query))}
🔹 Payload: ${requestBody}

[Response]:

🔹 Status: ${res.statusCode}
🔹 Duration: ${duration}ms
🔹 Body:\n${formattedResponse}
    `.trim(),
    );
  });

  next();
};

export default requestAndResponseLogger;
