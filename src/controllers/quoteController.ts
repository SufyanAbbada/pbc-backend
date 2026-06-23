import QuoteRepository from "../repositories/quoteRepository";
import S3Service from "../services/s3Service";
import generalErrorResponse from "../utils/generalErrorResponse";
import { PaginationResponse } from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class QuoteController {
  async addQuote(req: Request, res: Response) {
    try {
      const {
        price,
        timeline,
        primaryImage,
        description,
        secondaryImage,
        termsAndConditions,
        rfqId,
        user: { id: userId },
      } = req.body;

      const primaryPictureURL = primaryImage
        ? await S3Service.uploadAsset(primaryImage)
        : undefined;
      const secondaryImageURL = secondaryImage
        ? await S3Service.uploadAsset(secondaryImage)
        : undefined;

      const quote = await QuoteRepository.createQuote({
        rfqId: Number(rfqId),
        userId: Number(userId),
        primaryImage: primaryPictureURL,
        secondaryImage: secondaryImageURL,
        price: Number(price),
        termsAndConditions,
        timeline,
        description,
      });

      return res.status(201).json({
        message: "Quote created successfully",
        data: quote,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllQuotes(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { quote, totalCount } = await QuoteRepository.getAllQuotes(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Quotes fetched successfully",
        data: quote,
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

  async getQuoteById(req: Request, res: Response) {
    try {
      const { quoteId } = req.params;
      const quote = await QuoteRepository.getQuoteById(Number(quoteId));

      if (!quote) {
        return res.status(404).json({
          error: [
            {
              path: "quoteId",
              msg: "We couldn't find a quote with the ID you provided. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Quote fetched successfully",
        data: quote,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getQuoteByRfqId(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { rfqId } = req.params;
      const { quotes, totalCount } = await QuoteRepository.getQuoteByRfqId(
        Number(rfqId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Quote fetched successfully",
        data: quotes,
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

  async searchQuotes(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { quotes, totalCount } = await QuoteRepository.searchQuotes(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for quotes fetched successfully",
        data: quotes,
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

  async updateQuote(req: Request, res: Response) {
    try {
      const { quoteId } = req.params;
      const { price, termsAndConditions, description } = req.body;

      const updatedQuote = await QuoteRepository.updateQuote(Number(quoteId), {
        price: Number(price),
        termsAndConditions,
        description,
      });

      return res.status(206).json({
        message: "Quote updated successfully",
        data: updatedQuote,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new QuoteController();
