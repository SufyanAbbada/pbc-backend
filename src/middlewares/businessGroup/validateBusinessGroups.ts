import BusinessGroupRepository from "../../repositories/BusinessGroupRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateBusinessGroups: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessGroup } = req.body;

    const { businessGroups: allBusinessGroups } =
      await BusinessGroupRepository.getAllBusinessGroups();

    const allBusinessGroupIds = allBusinessGroups.map((group) => group.id);
    const allExist = businessGroup.every((id: number) =>
      allBusinessGroupIds.includes(id),
    );

    if (!allExist) {
      res.status(400).json({
        error: [
          {
            path: "businessGroups",
            msg: "One or more business groups you provided are invalid",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    generalErrorResponse(error, res);
  }
};

export default validateBusinessGroups;
