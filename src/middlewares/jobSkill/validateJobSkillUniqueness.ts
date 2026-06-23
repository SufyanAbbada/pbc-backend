import { Request, Response, NextFunction } from "express";
import JobSkillRepository from "../../repositories/JobSkillRepository";

const validateJobSkillUniqueness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const existingSkill = await JobSkillRepository.getJobSkillByName(name);

    if (existingSkill) {
      res.status(400).json({
        error: [
          {
            path: "name",
            msg: "Job skill with this name already exists",
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

export default validateJobSkillUniqueness;
