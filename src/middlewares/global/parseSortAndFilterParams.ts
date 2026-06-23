import { Request, Response, NextFunction, RequestHandler } from "express";
import { GeneralStatus, WishlistStatus } from "../../common/enums";

const parseSortAndFilterParams = (
  statusEnum: typeof GeneralStatus | typeof WishlistStatus,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let { sortBy, status } = req.query;
    req.body.filters = {};

    if (sortBy) {
      const sortString = sortBy as string;
      const [field, order] = sortString.split(":");
      if (field && ["createdAt", "updatedAt", "title"].includes(field)) {
        req.body.filters.sortBy = {
          field,
          order: order === "asc" ? "asc" : "desc",
        };
      }
    }

    if (status) {
      const statusString = status as string;
      if ((Object.values(statusEnum) as string[]).includes(statusString)) {
        req.body.filters.status = statusString;
      }
    }

    next();
  };
};

export default parseSortAndFilterParams;
