import BusinessGroupRepository from "../../repositories/BusinessGroupRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction } from "express";

const validateBusinessGroupUniqueness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const existingGroup =
      await BusinessGroupRepository.getBusinessGroupByName(name);

    if (existingGroup) {
      res.status(409).json({
        error: [
          {
            path: "name",
            msg: "Business group with this name already exists. Try with another name",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateBusinessGroupUniqueness;
