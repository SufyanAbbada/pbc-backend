import addressRepository from "../../repositories/addressRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateAddressExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { addressId } = req.body;

  const address = await addressRepository.getAddressById(Number(addressId));

  if (!address) {
    res.status(400).json({
      error: [
        {
          path: "addressId",
          msg: "We couldn't find the address. Please make sure the address is correct",
        },
      ],
    });
    return;
  }

  req.body.address = address;

  next();
};

export default validateAddressExistence;
