import generalErrorResponse from "../../utils/generalErrorResponse";
import { RoleIdStr } from "../../common/enums";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateRoleIds: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roleId } = req.query;

    if (roleId && typeof roleId === "string") {
      let validRolesIds: Number[] = [];
      let roleIdString = new Set(roleId.split(","));

      roleIdString.forEach((role) => {
        if (Object.values(RoleIdStr).includes(role as RoleIdStr)) {
          validRolesIds.push(Number(role));
        }
      });

      if (validRolesIds.length === 0) {
        res.status(404).json({
          error: [
            {
              path: "roleId",
              msg: "None of the provided Role IDs are valid, or there are no roles found for any user",
            },
          ],
        });
        return;
      }

      req.body.roleIds = validRolesIds;
    }
    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateRoleIds;
