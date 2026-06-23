import DiscountRepository from "../repositories/DiscountRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class DiscountController {
  async addDiscount(req: Request, res: Response) {
    const {
      title,
      description,
      value,
      discountCode,
      startDate,
      validUntil,
      isFeatured,
      user: { id: userId },
    } = req.body;

    try {
      const newDiscount = await DiscountRepository.createDiscount({
        title: title,
        description: description,
        value: Number(value),
        discountCode: discountCode,
        startDate: startDate,
        validUntil: validUntil,
        isFeatured: isFeatured,
        userId: Number(userId),
      });

      return res.status(201).json({
        message: "Discount Added Successfully",
        data: newDiscount,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getDiscounts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { discounts, totalCount } =
        await DiscountRepository.getAllDiscounts(page, limit);

      const response: PaginationResponse = {
        message:
          "The discounts have been successfully retrieved and are ready for you.",
        data: discounts,
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

  async getDiscountById(req: Request, res: Response) {
    try {
      const discount = await DiscountRepository.findDiscountById(
        Number(req.params.discountId),
      );

      if (!discount)
        return res.status(404).json({
          error: [
            {
              path: "discountId",
              msg: "We couldn't find that discount. Please double-check the code and try again",
            },
          ],
        });
      return res.status(200).json({
        message: "Discount Fetched Successfully",
        data: discount,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteDiscountById(req: Request, res: Response) {
    try {
      const discount = await DiscountRepository.deleteDiscountById(
        Number(req.params.discountId),
      );

      return res.status(200).json({
        message: "Discount Deleted Successfully",
        data: discount,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyDiscounts(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const discounts = await DiscountRepository.findDiscountByUserId(
        Number(userId),
      );

      if (!discounts)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find any discounts for this user at the moment.",
            },
          ],
        });
      return res.status(200).json({
        message: "Discount Fetched Successfully",
        data: discounts,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserDiscounts(req: Request, res: Response) {
    try {
      const discount = await DiscountRepository.findDiscountByUserId(
        Number(req.params.userId),
      );

      if (!discount)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find any discount for this user at the moment.",
            },
          ],
        });
      return res.status(200).json({
        message: "Discount Fetched Successfully",
        data: discount,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateDiscountById(req: Request, res: Response) {
    const { discountId } = req.params;
    const {
      title,
      description,
      value,
      discountCode,
      startDate,
      validUntil,
      user: { id: userId },
    } = req.body;

    try {
      const updatedDiscount = await DiscountRepository.updateDiscountById(
        Number(discountId),
        {
          title: title,
          description: description,
          value: Number(value),
          discountCode: discountCode,
          startDate: startDate,
          validUntil: validUntil,
          userId: Number(userId),
        },
      );

      return res.status(202).json({
        message: "Discount Updated Successfully",
        data: updatedDiscount,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateDiscountStatus(req: Request, res: Response) {
    const { isActive } = req.body;
    try {
      const updatedDiscount = await DiscountRepository.updateDiscountStatus(
        Number(req.params.discountId),
        isActive,
      );

      res.status(202).json({
        message: "Discount Updated Successfully",
        data: updatedDiscount,
      });
      return;
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateDiscountFeaturedStatus(req: Request, res: Response) {
    const { isFeatured } = req.body;
    try {
      const updatedDiscount =
        await DiscountRepository.updateDiscountFeaturedStatus(
          Number(req.params.discountId),
          isFeatured,
        );

      res.status(202).json({
        message: "Discount Updated Successfully",
        data: updatedDiscount,
      });
      return;
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new DiscountController();
