import { Request, Response, NextFunction, RequestHandler } from "express";

const parsePaginationParams: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page: pageQuery, limit: limitQuery } = req.query;

  const page = pageQuery ? parseInt(pageQuery as string) : undefined;
  const limit = limitQuery ? parseInt(limitQuery as string) : undefined;

  req.body.pagination = {
    page: pageQuery && limitQuery ? page : undefined,
    limit: pageQuery && limitQuery ? limit : undefined,
  };

  next();
};

export default parsePaginationParams;
