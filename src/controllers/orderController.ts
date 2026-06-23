import OrderRepository from "../repositories/orderRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { CartItem, Order, PaginationResponse } from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";
class OrderController {
  async getAllOrders(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { orders, totalCount } = await OrderRepository.getAllOrders(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Orders fetched successfully",
        data: orders,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const singleOrder = await OrderRepository.getSingleOrder(Number(orderId));

      if (!singleOrder)
        return res.status(404).json({
          error: [
            {
              path: "orderId",
              msg: "We couldn't find an order with the ID you provided. Please recheck the ID",
            },
          ],
        });

      return res.status(200).json({
        message: "Order fetched successfully",
        data: singleOrder,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { userId } = req.params;

      const { orders, totalCount } = await OrderRepository.getUserOrders(
        Number(userId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "User Orders fetched successfully",
        data: orders,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyOrders(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user: { id: userId },
      } = req.body;

      const { orders, totalCount } = await OrderRepository.getUserOrders(
        Number(userId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "User Orders fetched successfully",
        data: orders,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getSellerOrders(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      let { orders } = await OrderRepository.getAllOrders();

      if (orders.length > 0) {
        orders = orders.filter((order) => {
          if (Array.isArray(order.items) && order.items.length > 0) {
            const item = order.items[0] as unknown as CartItem | undefined;
            return item && item.sellerId === userId;
          }
          return false;
        });
      }

      return res.status(200).json({
        message: "Seller Orders fetched successfully",
        data: orders,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new OrderController();
