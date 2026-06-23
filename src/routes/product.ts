import ProductController from "../controllers/productController";
import validateProductExistence from "../middlewares/product/validateProductExistence";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validatePrice from "../middlewares/product/validatePrice";
import validateUserExistenceById from "../middlewares/auth/validateUserExistenceById";
import validateProductPictures from "../middlewares/product/validateProductPictures";
import validateOptionalProductPictures from "../middlewares/product/validateOptionalProductPictures";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateOptionalNumericField from "../middlewares/global/validateOptionalNumericField";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateOptionalCategoryExistence from "../middlewares/category/validateCategoryExistence copy";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateProductDependency from "../middlewares/product/validateProductDependency";
import { Router, Request, Response } from "express";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";
import { Action, SourceType, Subject } from "../common/enums";

const productRouter = Router();

productRouter.post(
  "/add",
  configureMulter(["primaryImage", "secondaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateId("categoryId", SourceType.BODY),
    ...validateTitles("name"),
    ...validatePrice,
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.PRODUCT),
  validateUserExistenceById,
  validateProductPictures,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.addProduct(req, res);
  },
);

productRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PRODUCT),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.getAllProducts(req, res);
  },
);

productRouter.get(
  "/search",
  [
    ...validateToken,
    ...validateQueryField("search"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ProductController.searchProducts(req, res);
  },
);

productRouter.get(
  "/:productId",
  [...validateToken, ...validateId("productId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PRODUCT),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.getProductById(req, res);
  },
);

productRouter.get(
  "/my/products",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PRODUCT),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ProductController.getAllMyProducts(req, res);
  },
);

productRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PRODUCT),
  validateUserExistenceByIdParam,
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.getAllUserProducts(req, res);
  },
);

productRouter.get(
  "/category/:categoryId",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateId("categoryId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PRODUCT),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.getCategorizedProducts(req, res);
  },
);

productRouter.patch(
  "/:productId",
  configureMulter(["primaryImage", "secondaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateOptionalId("categoryId", SourceType.BODY),
    ...validateId("productId"),
    ...validateOptional("name"),
    ...validateOptionalNumericField("price"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.PRODUCT),
  validateProductExistence(),
  validateOptionalCategoryExistence(SourceType.BODY),
  validateOptionalProductPictures,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.updateProduct(req, res);
  },
);

productRouter.delete(
  "/:productId",
  [...validateToken, ...validateId("productId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.PRODUCT),
  validateProductExistence(),
  validateProductDependency(),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ProductController.deleteProduct(req, res);
  },
);

export default productRouter;
