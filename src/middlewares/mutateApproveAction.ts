// basic middleware to check if the user is an admin
import { Request, Response, NextFunction } from "express";
import { Action, RoleId, Subject } from "../common/enums";

const mutateApproveAction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: {
        Role: { id: roleId },
      },
    } = req.body;

    if (
      req.params.taskId &&
      (roleId === RoleId.DIRECTOR || roleId === RoleId.ADMIN)
    ) {
      req.body.bypass = true;
    } else if (
      req.params.ticketId &&
      (roleId === RoleId.CHAIRMAN ||
        roleId === RoleId.GENERAL_SECRETARY ||
        roleId === RoleId.VC_FINANCE ||
        roleId === RoleId.DIRECTOR ||
        roleId === RoleId.ADMIN ||
        roleId === RoleId.PBC_STAFF)
    ) {
      req.body.bypass = true;
    }

    next();
  } catch (error: any) {
    return next(error);
  }
};

export default mutateApproveAction;
