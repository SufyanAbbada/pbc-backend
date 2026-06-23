import generalErrorResponse from "../../utils/generalErrorResponse";
import addressRepository from "../../repositories/addressRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateAddressOwner: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { addressId } = req.params;
    const {
      user: { id: userId },
    } = req.body;

    const address = await addressRepository.getAddressById(Number(addressId));

    if (Number(userId) !== address?.userId) {
      res.status(400).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this Address. User can only update/delete their own address",
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

export default validateAddressOwner;
