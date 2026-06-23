import { Request, Response, NextFunction, RequestHandler } from "express";
import { SortOrder } from "../../common/enums";

const validateAndParseSortParam: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { sort } = req.query;

  if (sort) {
    const sortOrder = sort as SortOrder;
    if (sortOrder !== SortOrder.ASC && sortOrder !== SortOrder.DESC) {
      res.status(400).json({
        error: [
          {
            path: "sort",
            msg: "Sort order must be either 'asc' or 'desc'",
          },
        ],
      });
      return;
    }

    req.body.sort = sortOrder;
  }

  next();
};

export default validateAndParseSortParam;
