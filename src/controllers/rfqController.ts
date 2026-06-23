import RfqRepository from "../repositories/RfqRepository";
import quoteRepository from "../repositories/quoteRepository";
import S3Service from "../services/s3Service";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class RfqController {
  async addRfq(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        categoryName,
        quantity,
        budget,
        deadline,
        primaryImage,
        secondaryImage,
        user: { id: userId },
        productId,
      } = req.body;

      const primaryImageURL = primaryImage
        ? await S3Service.uploadAsset(primaryImage)
        : undefined;

      const secondaryImageURL = secondaryImage
        ? await S3Service.uploadAsset(secondaryImage)
        : undefined;

      const rfq = await RfqRepository.createRfq({
        userId: Number(userId),
        title,
        description,
        categoryName,
        primaryImage: primaryImageURL,
        secondaryImage: secondaryImageURL,
        quantity: Number(quantity),
        budget: Number(budget),
        deadline,
        ...(productId && { productId: Number(productId) }),
      });

      return res.status(201).json({
        message: "RFQ created successfully",
        data: rfq,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllRfq(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { rfqs, totalCount } = await RfqRepository.getAllRfq(page, limit);

      const response: PaginationResponse = {
        message: "RFQs fetched successfully",
        data: rfqs,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyRfq(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user: { id: userId },
      } = req.body;

      const { rfqs, totalCount } = await RfqRepository.getMyRfq(
        Number(userId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "RFQs fetched successfully",
        data: rfqs,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getRfqById(req: Request, res: Response) {
    try {
      const { rfqId } = req.params;
      const rfq = await RfqRepository.getRfqById(Number(rfqId));

      if (!rfq) {
        return res.status(404).json({
          error: [
            {
              path: "rfqtId",
              msg: "We couldn't find an RFQ with the ID you entered. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "RfQ fetched successfully",
        data: rfq,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async updateRfqbyId(req: Request, res: Response) {
    const { rfqId } = req.params;
    const {
      title,
      description,
      categoryName,
      quantity,
      budget,
      deadline,
      primaryImage,
      secondaryImage,
      user: { id: userId },
    } = req.body;

    try {
      const primaryImageURL = primaryImage
        ? await S3Service.uploadAsset(primaryImage)
        : undefined;

      const secondaryImageURL = secondaryImage
        ? await S3Service.uploadAsset(secondaryImage)
        : undefined;
      const updatedRfq = await RfqRepository.updateRfqById(Number(rfqId), {
        userId: Number(userId),
        title,
        description,
        categoryName,
        primaryImage: primaryImageURL,
        secondaryImage: secondaryImageURL,
        ...(quantity && { quantity: Number(quantity) }),
        ...(budget && { budget: Number(budget) }),
        deadline,
      });

      return res.status(202).json({
        message: "RFQ Updated Successfully",
        data: updatedRfq,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteRfq(req: Request, res: Response) {
    try {
      const { rfqId } = req.params;

      const deletedRfq = await RfqRepository.deleteRfqById(Number(rfqId));

      return res.status(206).json({
        message: "RFQ has been removed",
        data: deletedRfq,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async addAwardedQuote(req: Request, res: Response) {
    try {
      const { rfqId } = req.params;
      const { quoteId } = req.body;

      const rfq = await RfqRepository.addAwardedQuoteId(
        Number(rfqId),
        Number(quoteId),
      );
      await quoteRepository.makeQuoteStatusAwarded(Number(quoteId));
      return res.status(206).json({
        message: "Quote has been Awarded Successfully",
        data: rfq,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async updateRfqStatus(req: Request, res: Response) {
    try {
      const { rfqId } = req.params;
      const { status } = req.body;

      const rfq = await RfqRepository.updateRfqStatus(Number(rfqId), status);

      return res.status(206).json({
        message: "RFQ status has been updated Successfully",
        data: rfq,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyAwardedRfq(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user: { id: userId },
      } = req.body;

      const { rfqs, totalCount } = await RfqRepository.awardedRFQs(
        Number(userId),
        page,
        limit,
      );
      const response: PaginationResponse = {
        message: "RFQs fetched successfully",
        data: rfqs,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };
      return res.status(200).json(response);
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async searchRfqs(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { rfqs, totalCount } = await RfqRepository.searchRfqs(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for RFQs fetched successfully",
        data: rfqs,
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
}

export default new RfqController();
