import UserRepository from "../../repositories/UserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RoleIdStr } from "../../common/enums";
import { Request, Response, NextFunction } from "express";

const validateAssigneeUsersExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { assignees } = req.body;

    const invalidIds: number[] = [];
    const validIds: number[] = [];

    const [adminResult, pbcStaffResult] = await Promise.all([
      UserRepository.getAllUsers(undefined, undefined, undefined, [
        Number(RoleIdStr.ADMIN),
      ]),
      UserRepository.getAllUsers(undefined, undefined, undefined, [
        Number(RoleIdStr.PBC_STAFF),
      ]),
    ]);

    const adminUsers = adminResult.users;
    const pbcStaffUsers = pbcStaffResult.users;

    const adminIds = [
      ...adminUsers.map((user) => user.id),
      ...pbcStaffUsers.map((user) => user.id),
    ];

    for (const id of assignees) {
      if (!adminIds.includes(id)) {
        invalidIds.push(id);
      } else {
        validIds.push(id);
      }
    }

    if (invalidIds.length === assignees.length) {
      res.status(400).json({
        error: [
          {
            path: "assignees",
            msg: "None of the provided assignee IDs are valid. Please recheck the IDs",
          },
        ],
      });
      return;
    }

    req.body.assignees = validIds;
    req.body.invalidAssigneeIds = invalidIds;
    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateAssigneeUsersExistence;
