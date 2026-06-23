import BusinessGroupRepository from "../../repositories/BusinessGroupRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateBusinessGroupExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { businessGroupId } = req.params;

    const businessGroup = await BusinessGroupRepository.getBusinessGroupById(
      Number(businessGroupId),
    );

    if (!businessGroup) {
      res.status(404).json({
        error: [
          {
            path: "businessGroupId",
            msg: "The specified business group Id does not exist or is invalid.",
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

export default validateBusinessGroupExistence;
