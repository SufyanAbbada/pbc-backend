import defineAbility, { AppAbility } from "../../services/caslService";
import generalErrorResponse from "../../utils/generalErrorResponse";
import resourceConfig, {
  adminPermittedMutations,
} from "../../config/resourceConfig";
import { Request, Response, NextFunction } from "express";
import { Action, Subject } from "../../common/enums";

interface PermissionRequest extends Request {
  ability: AppAbility;
}

const validatePermissions = (action: Action, subject: Subject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, bypass } = req.body;

      const ability = defineAbility(user);

      (req as PermissionRequest).ability = ability;

      if (
        (subject === Subject.EVENT &&
          action === Action.READ &&
          req.url.includes("board-meetings") &&
          adminPermittedMutations[Subject.EVENT]?.includes(user.Role.id)) ||
        !ability.can(action, subject)
      ) {
        res.status(403).json({
          error: [
            {
              msg: `You do not have permission to access this route / functionality. '${user.Role.name}' roles cannot '${action}' a '${subject}'.`,
              path: "role",
            },
          ],
        });
        return;
      }

      if (bypass) {
        next();
        return;
      }

      // In case of Delete or Update action of Subjects in adminPermittedMutations we are skipping ownership check
      if (
        adminPermittedMutations[subject] &&
        !adminPermittedMutations[subject].includes(user.Role.id)
      ) {
        next();
        return;
      }

      // For Update or Delete actions, we are checking the item ownership
      if (
        (action === Action.UPDATE || action === Action.DELETE) &&
        resourceConfig[subject]
      ) {
        const { idField, queryFunction } = resourceConfig[subject];
        let resourceId = req.params[idField];

        if (subject === Subject.CART) resourceId = req.body?.cart.id;

        const resource = resourceId
          ? await queryFunction(Number(resourceId), user.id)
          : null;

        if (!resource) {
          res.status(404).json({
            error: [
              {
                msg: `The requested resource with the specified ID was not found or you do not have access to it. '${user.Role.name}' roles can '${action}' their own '${subject}'.`,
                path: "resource",
              },
            ],
          });
          return;
        }
      }

      next();
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  };
};

export default validatePermissions;
