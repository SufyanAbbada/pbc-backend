import AddressController from "../controllers/addressController";
import validateId from "../middlewares/global/validateId";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateTitles from "../middlewares/global/validateTitles";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateZipCode from "../middlewares/global/validateZipCode";
import validateAddressOwner from "../middlewares/address/validateAddressOwner";
import validateAddressUniqueness from "../middlewares/address/validateAddressUniqueness";
import validateAddressExistenceById from "../middlewares/address/validateAddressExistenceById";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateAddressDependency from "../middlewares/address/validateAddressDependency";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const addressRouter = Router();

addressRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("addressLine1"),
    ...validateOptional("addressLine2"),
    ...validateTitles("city"),
    ...validateTitles("country"),
    ...validateZipCode,
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ADDRESS),
  validateAddressUniqueness,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await AddressController.createAddress(req, res);
  },
);

addressRouter.get(
  "/my/address",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ADDRESS),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await AddressController.getAllUserAddress(req, res);
  },
);

addressRouter.get(
  "/:addressId",
  [...validateToken, ...validateId("addressId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ADDRESS),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await AddressController.getAddressById(req, res);
  },
);

addressRouter.put(
  "/:addressId",
  [
    ...validateToken,
    ...validateTitles("addressLine1"),
    ...validateOptional("addressLine2"),
    ...validateTitles("city"),
    ...validateTitles("country"),
    ...validateZipCode,
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.ADDRESS),
  validateAddressExistenceById,
  validateAddressOwner,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await AddressController.updateAddress(req, res);
  },
);

addressRouter.delete(
  "/:addressId",
  [...validateToken, ...validateId("addressId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.ADDRESS),
  validateAddressExistenceById,
  validateAddressOwner,
  validateAddressDependency(),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await AddressController.deleteAddress(req, res);
  },
);

export default addressRouter;
