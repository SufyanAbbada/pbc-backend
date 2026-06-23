import { Request, Response, NextFunction, RequestHandler } from "express";
import { JobStatus } from "../../common/enums";

const validateAndParseFilterParam: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { filter } = req.query;

  if (filter) {
    const status = filter as JobStatus;
    if (!Object.values(JobStatus).includes(status)) {
      res.status(400).json({
        error: [
          {
            path: "filter",
            msg: "The filter must be one of the following: 'OPEN', 'FILLED', or 'CLOSED'",
          },
        ],
      });
      return;
    }

    req.body.filter = status;
  }

  next();
};

export default validateAndParseFilterParam;
