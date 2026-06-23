import generalErrorResponse from "../../utils/generalErrorResponse";
import { DateType } from "../../common/enums";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { toFormattedTime } from "../../utils/datesProcessor";

const validateAndParseDate = (
  fieldName: string,
  dateType: DateType = DateType.FUTURE,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateValue = req.body[fieldName];
      if (!dateValue) return next();

      const parsedDate = new Date(dateValue);

      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({
          error: [
            {
              path: fieldName,
              msg: `'${fieldName}’ is not a valid date. Please enter a correct date and try again`,
            },
          ],
        });
        return;
      }

      const now = new Date();

      switch (dateType) {
        case DateType.PAST:
          if (parsedDate > now) {
            res.status(400).json({
              error: [
                {
                  path: fieldName,
                  msg: `‘${fieldName}’ must be a past date. Please select a valid date from the past`,
                },
              ],
            });
            return;
          }
          break;

        case DateType.FUTURE:
        case DateType.START:
        case DateType.END:
          if (parsedDate < now) {
            res.status(400).json({
              error: [
                {
                  path: fieldName,
                  msg: `'${fieldName}' must be a future date & time (${toFormattedTime(now)} - UAE).`,
                },
              ],
            });
            return;
          }

          if (dateType === DateType.END) {
            const startField = getPotentialStartFields(fieldName);
            if (!startField) break;
            if (req.body[startField] instanceof Date) {
              const startDate = req.body[startField];
              if (parsedDate <= startDate) {
                res.status(400).json({
                  error: [
                    {
                      path: fieldName,
                      msg: `‘${fieldName}’ must be after ‘${startField}’. Please choose a date that comes later`,
                    },
                  ],
                });
                return;
              }
              break;
            }
          }
          break;
      }

      req.body[fieldName] = parsedDate;
      next();
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  };
};

function getPotentialStartFields(endFieldName: string): string {
  return endFieldName === "endDate" || endFieldName === "validUntil"
    ? "startDate"
    : "";
}

export default validateAndParseDate;
