import addressRepository from "../../repositories/addressRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateAddressExistenceById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { addressId } = req.params;

  const address = await addressRepository.getAddressById(Number(addressId));

  if (!address) {
    res.status(404).json({
      error: [
        {
          path: "addressId",
          msg: "We couldn't find the address. Please check the Address ID and provide a valid one",
        },
      ],
    });
    return;
  }

  next();
};

export default validateAddressExistenceById;
