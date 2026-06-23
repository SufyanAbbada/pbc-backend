import CategoryRepository from "../repositories/CategoryRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import generateSlug from "../utils/nameToSlugConverter";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class CategoryController {
  async addCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await CategoryRepository.addCategory({
        name,
        slug: await generateSlug(name),
        description,
      });

      return res.status(201).json({
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { categories, totalCount } =
        await CategoryRepository.getAllCategories(page, limit);

      const response: PaginationResponse = {
        message: "Categories fetched successfully",
        data: categories,
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

  async getCategoryById(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const category = await CategoryRepository.getCategoryById(
        Number(categoryId),
      );

      if (!category) {
        return res.status(404).json({
          path: "categoryId",
          message:
            "We couldn't find this category in the system. Please recheck the category ID",
        });
      }

      return res.status(200).json({
        message: "Category fetched successfully",
        data: category,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;

      const updatedCategory = await CategoryRepository.updateCategory(
        Number(categoryId),
        {
          name,
          slug: await generateSlug(name),
          description,
        },
      );

      return res.status(206).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const deletedCategory = await CategoryRepository.deleteCategory(
        Number(categoryId),
      );

      return res.status(206).json({
        message: "Category has been removed",
        data: deletedCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new CategoryController();
