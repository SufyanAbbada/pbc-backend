import OrderRepository from "../../repositories/orderRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateAddressDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const addressId =
      source === SourceType.BODY ? req.body.addressId : req.params.addressId;

    const dependentOrders = await OrderRepository.getOrdersByAddressId(
      Number(addressId),
    );

    if (dependentOrders.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "addressId",
            msg: "You cannot delete this address as it is associated with some orders.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateAddressDependency;
