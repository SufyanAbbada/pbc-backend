import addressRepository from "../../repositories/addressRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateAddressUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    addressLine1,
    addressLine2,
    city,
    country,
    zipCode,
    user: { id: userId },
  } = req.body;

  const address = await addressRepository.getAddress(
    Number(userId),
    addressLine1,
    addressLine2,
    city,
    country,
    zipCode,
  );

  if (address) {
    res.status(409).json({
      error: [
        {
          path: "Address",
          msg: "This address already exists. Please provide a different one",
        },
      ],
    });
    return;
  }

  next();
};

export default validateAddressUniqueness;
