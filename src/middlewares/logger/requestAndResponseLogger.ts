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
        requestBody = `Array with ${originalRequestBody.length} items:\n${formatData(originalRequestBody)}`;
      } else if (Object.keys(originalRequestBody).length) {
        requestBody = formatData(originalRequestBody);
      }
    }

    const formattedResponse = formatData(responseBody);

    logger.info(
      `
[Request]:

🔹 Method: ${req.method}
🔹 URL: ${req.originalUrl}
🔹 Headers:\n${formatData(req.headers)}
🔹 Query:\n${formatData(req.query)}
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
