import { Request, Response, NextFunction } from "express";
import JobSkillRepository from "../../repositories/JobSkillRepository";

const validateJobSkillExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jobSkillId } = req.params;
    const jobSkill = await JobSkillRepository.getJobSkillById(
      Number(jobSkillId),
    );

    if (!jobSkill) {
      res.status(404).json({
        error: [
          {
            path: "id",
            msg: "We couldn't find the Job skill. Please recheck the Job Skill ID",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateJobSkillExistence;
