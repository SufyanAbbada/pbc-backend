import CartController from "../controllers/cartController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateProductExistence from "../middlewares/product/validateProductExistence";
import validateExistingCart from "../middlewares/cart/validateExistingCart";
import validateDiscountCodeExistence from "../middlewares/cart/validateDiscountCodeExistence";
import validateCartMerchant from "../middlewares/cart/validateCartMerchant";
import validateDiscountApplied from "../middlewares/cart/validateDiscountApplied";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateIntegerField from "../middlewares/global/validateIntegerField";
import validateRegistrationNumbers from "../middlewares/global/validateRegistrationNumbers";
import validateSameProductExistence from "../middlewares/cart/validateSameProductExistence";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateDiscountActive from "../middlewares/discount/validateDiscountActive";
import validateDiscountCodeValidity from "../middlewares/discount/validateDiscountValidity";
import validateAddressExistence from "../middlewares/cart/validateAddressExistence";
import validateUserAddress from "../middlewares/address/validateUserAddress";
import validateTransactionIdUniqueness from "../middlewares/cart/validateTransactionIdUniqueness";
import validateProductOwner from "../middlewares/cart/validateProductOwner";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, SourceType, Subject } from "../common/enums";

const cartRouter = Router();

cartRouter.post(
  "/checkout",
  [
    ...validateToken,
    ...validateRegistrationNumbers("transactionId"),
    ...validateIntegerField("addressId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ORDER),
  validateAddressExistence,
  validateExistingCart,
  validateUserAddress,
  validateTransactionIdUniqueness,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.checkout(req, res);
  },
);

cartRouter.post(
  "/add",
  [...validateToken, ...validateId("productId", SourceType.BODY), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.CART),
  validateProductExistence(SourceType.BODY),
  validateCartMerchant,
  validateSameProductExistence,
  validateProductOwner(SourceType.BODY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.addToCart(req, res);
  },
);

cartRouter.post(
  "/apply-discount",
  [...validateToken, ...validateTitles("discountCode"), validate],
  extractUserFromToken,
  validateExistingCart,
  validatePermissions(Action.UPDATE, Subject.CART),
  validateDiscountCodeExistence,
  validateDiscountActive,
  validateDiscountCodeValidity,
  validateDiscountApplied,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.applyDiscount(req, res);
  },
);

cartRouter.patch(
  "/remove-discount",
  [...validateToken, validate],
  extractUserFromToken,
  validateExistingCart,
  validatePermissions(Action.UPDATE, Subject.CART),
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.removeDiscount(req, res);
  },
);

cartRouter.patch(
  "/:productId",
  [...validateToken, ...validateId("productId"), validate],
  extractUserFromToken,
  validateExistingCart,
  validatePermissions(Action.UPDATE, Subject.CART),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.removeFromCart(req, res);
  },
);

cartRouter.get(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.CART),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CartController.getCart(req, res);
  },
);

cartRouter.delete(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateExistingCart,
  async (req: Request, res: Response) => {
    await CartController.clearCart(req, res);
  },
);

export default cartRouter;
