import { Request, Response } from "express";
import JobSkillRepository from "../repositories/JobSkillRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class JobSkillController {
  async addJobSkill(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const jobSkill = await JobSkillRepository.addJobSkill(name);

      return res.status(201).json({
        message: "Job skill created successfully",
        data: jobSkill,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllJobSkills(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { jobSkills, totalCount } =
        await JobSkillRepository.getAllJobSkills(page, limit);

      const response: PaginationResponse = {
        message: "Job skills fetched successfully",
        data: jobSkills,
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

  async getJobSkillById(req: Request, res: Response) {
    try {
      const { jobSkillId } = req.params;
      const jobSkill = await JobSkillRepository.getJobSkillById(
        Number(jobSkillId),
      );

      if (!jobSkill) {
        return res.status(404).json({
          error: [
            {
              path: "id",
              msg: "We couldn't find a job skill with this ID. Please check the ID and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Job skill fetched successfully",
        data: jobSkill,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateJobSkill(req: Request, res: Response) {
    try {
      const { jobSkillId } = req.params;
      const { name } = req.body;

      const updatedJobSkill = await JobSkillRepository.updateJobSkill(
        Number(jobSkillId),
        name,
      );

      return res.status(200).json({
        message: "Job skill updated successfully",
        data: updatedJobSkill,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new JobSkillController();
