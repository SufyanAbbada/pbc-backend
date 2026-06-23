import { Request, Response, NextFunction } from "express";

const validateStartAndEndDate = (
  startDateFieldName: string,
  endDateFieldName: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.body[startDateFieldName]
      ? new Date(req.body[startDateFieldName])
      : null;
    const endDate = req.body[endDateFieldName]
      ? new Date(req.body[endDateFieldName])
      : null;

    if (!startDate || !endDate) {
      return next();
    }

    if (startDate > endDate) {
      res.status(400).json({
        error: [
          {
            path: startDateFieldName,
            msg: `'${startDateFieldName}' must be earlier than '${endDateFieldName}'`,
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateStartAndEndDate;
