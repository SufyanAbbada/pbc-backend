import { Request, Response, NextFunction, RequestHandler } from "express";

const validateIsIntMinLessThanMax = (
  minFieldName: string,
  maxFieldName: string,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { [minFieldName]: min, [maxFieldName]: max } = req.body;

    if (min || max) {
      const minValue = Number(min || 0);
      const maxValue = Number(max || 0);

      if (minValue < 0) {
        res.status(400).json({
          error: [
            {
              path: minFieldName,
              msg: `'${minFieldName}' must be a positive integer. Please enter a valid number`,
            },
          ],
        });
        return;
      }

      if (maxValue <= 0) {
        res.status(400).json({
          error: [
            {
              path: maxFieldName,
              msg: `'${maxFieldName}' must be a positive integer. Please provide a valid number`,
            },
          ],
        });
        return;
      }

      if (maxValue <= minValue) {
        res.status(400).json({
          error: [
            {
              path: `${minFieldName}, ${maxFieldName}`,
              msg: `'${minFieldName}' must be less than '${maxFieldName}'. Please adjust the values accordingly`,
            },
          ],
        });
        return;
      }
    }

    next();
  };
};

export default validateIsIntMinLessThanMax;
