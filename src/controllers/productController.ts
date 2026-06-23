import ProductRepository from "../repositories/ProductRepository";
import S3Service from "../services/s3Service";
import generalErrorResponse from "../utils/generalErrorResponse";
import { PaginationResponse } from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class ProductController {
  async addProduct(req: Request, res: Response) {
    try {
      const {
        name,
        price,
        description,
        primaryImage,
        secondaryImage,
        categoryId,
        user: { id: userId },
      } = req.body;

      const primaryPictureURL = await S3Service.uploadAsset(primaryImage);
      const secondaryImageURL = secondaryImage
        ? await S3Service.uploadAsset(secondaryImage)
        : undefined;

      const product = await ProductRepository.addProduct({
        name,
        price: Number(price),
        description,
        primaryImage: primaryPictureURL,
        secondaryImage: secondaryImageURL,
        categoryId: Number(categoryId),
        userId: Number(userId),
      });

      return res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { products, totalCount } = await ProductRepository.getAllProducts(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Products fetched successfully",
        data: products,
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

  async getAllMyProducts(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user: { id: userId },
      } = req.body;

      const { products, totalCount } =
        await ProductRepository.getAllUserProducts(Number(userId), page, limit);

      const response: PaginationResponse = {
        message: "Products fetched successfully",
        data: products,
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

  async getAllUserProducts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { products, totalCount } =
        await ProductRepository.getAllUserProducts(
          Number(req.params.userId),
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "Products fetched successfully",
        data: products,
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
  async getCategorizedProducts(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { page, limit } = req.body.pagination;

      const { products, totalCount } =
        await ProductRepository.getCategorizedProducts(
          Number(categoryId),
          page,
          limit,
        );

      const response: PaginationResponse = {
        message:
          "Products belonging to the given category fetched successfully",
        data: products,
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

  async getProductById(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const product = await ProductRepository.getProductById(Number(productId));

      if (!product) {
        return res.status(404).json({
          error: [
            {
              path: "productId",
              msg: "We couldn't find a product with the ID you entered. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const {
        name,
        price,
        description,
        primaryImage,
        secondaryImage,
        categoryId,
        user: { id: userId },
      } = req.body;

      let updatedPrimaryImage;
      let updatedSecondaryImage;

      if (primaryImage) {
        updatedPrimaryImage = await S3Service.uploadAsset(primaryImage);
      }
      if (secondaryImage) {
        updatedSecondaryImage = await S3Service.uploadAsset(secondaryImage);
      }

      const updatedProduct = await ProductRepository.updateProduct(
        Number(productId),
        {
          name,
          price: price ? Number(price) : undefined,
          description,
          primaryImage: updatedPrimaryImage,
          secondaryImage: updatedSecondaryImage,
          categoryId: categoryId ? Number(categoryId) : undefined,
          userId: Number(userId),
        },
      );

      return res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;

      const deletedProduct = await ProductRepository.deleteProduct(
        Number(productId),
      );

      return res.status(206).json({
        message: "Product has been removed",
        data: deletedProduct,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { products, totalCount } = await ProductRepository.searchProducts(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for products fetched successfully",
        data: products,
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

export default new ProductController();
