import generalErrorResponse from "../../utils/generalErrorResponse";
import addressRepository from "../../repositories/addressRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateUserAddress: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      addressId,
      user: { id: userId },
    } = req.body;

    const address = await addressRepository.getAddressById(Number(addressId));

    if (Number(userId) !== address?.userId) {
      res.status(400).json({
        error: [
          {
            path: "addressId",
            msg: "The provided address ID does not belong to the authenticated user.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateUserAddress;
