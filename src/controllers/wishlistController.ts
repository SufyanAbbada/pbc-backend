import wishlistRepository from "../repositories/wishlistRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { WishlistStatus } from "../common/enums";

class WishlistController {
  async addWishlist(req: Request, res: Response) {
    const { title, suggestions, user } = req.body;

    try {
      const newWishlist = await wishlistRepository.createWishlist({
        title,
        suggestions,
        userId: Number(user.id),
        status: WishlistStatus.PENDING,
      });

      return res.status(201).json({
        message: "Wishlist created successfully",
        data: newWishlist,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getWishlists(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        filters: { sortBy, status },
      } = req.body;

      const { wishlists, totalCount } =
        await wishlistRepository.getAllWishlists(page, limit, sortBy, status);

      const response: PaginationResponse = {
        message: "Wishlists fetched successfully",
        data: wishlists,
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

  async getUserWishlists(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.body.pagination || {};

      const { wishlists, totalCount } =
        await wishlistRepository.getWishlistsByUserId(
          Number(userId),
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "User wishlists fetched successfully",
        data: wishlists,
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

  async getWishlistById(req: Request, res: Response) {
    try {
      const { wishlistId } = req.params;
      const wishlist = await wishlistRepository.getWishlistById(
        Number(wishlistId),
      );

      if (!wishlist) {
        return res.status(404).json({
          error: [
            {
              path: "wishlistId",
              message: "Wishlist with the given Id is not found.",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Wishlist fetched successfully",
        data: wishlist,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyWishlist(req: Request, res: Response) {
    try {
      const {
        user,
        pagination: { page, limit },
        filters: { sortBy, status },
      } = req.body;

      const { wishlists, totalCount } =
        await wishlistRepository.getWishlistsByUserId(
          Number(user.id),
          page,
          limit,
          sortBy,
          status,
        );

      const response: PaginationResponse = {
        message: "Your wishlists fetched successfully",
        data: wishlists,
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

  async updateWishlistStatus(req: Request, res: Response) {
    try {
      const { wishlistId } = req.params;
      const { status, comment }: { status: WishlistStatus; comment: string } =
        req.body;

      const updatedWishlist = await wishlistRepository.updateWishlist(
        Number(wishlistId),
        { status, comment },
      );

      return res.status(200).json({
        message: "Wishlist status updated successfully",
        data: updatedWishlist,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateWishlist(req: Request, res: Response) {
    try {
      const { wishlistId } = req.params;
      const { title, suggestions } = req.body;

      const updatedWishlist = await wishlistRepository.updateWishlist(
        Number(wishlistId),
        { title, suggestions },
      );

      return res.status(200).json({
        message: "Wishlist updated successfully",
        data: updatedWishlist,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteWishlist(req: Request, res: Response) {
    try {
      const { wishlistId } = req.params;

      const deletedWishlist = await wishlistRepository.deleteWishlist(
        Number(wishlistId),
      );

      return res.status(200).json({
        message: "Wishlist has been removed",
        data: deletedWishlist,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchWishlists(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { wishlists, totalCount } =
        await wishlistRepository.searchWishlists(search as string, page, limit);

      const response: PaginationResponse = {
        message: "Search results for wishlists fetched successfully",
        data: wishlists,
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

export default new WishlistController();
