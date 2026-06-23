import TempUserRepository from "../../repositories/TempUserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateTempUserExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber, email } = req.body;
    const tempUser = await TempUserRepository.findTempUserByEmailAndPhone(
      email,
      phoneNumber,
    );

    if (!tempUser) {
      res.status(404).json({
        error: [
          {
            path: "phoneNumber",
            msg: "We couldn’t find a user with this phone number and email. Please register first.",
          },
        ],
      });
      return;
    }

    req.body.user = tempUser;
    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateTempUserExistence;
