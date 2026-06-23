import {
  AbilityBuilder,
  MongoAbility,
  createMongoAbility,
} from "@casl/ability";
import { Action, Subject, Permission } from "../common/enums";

export type AppAbility = MongoAbility<[Action, Subject]>;

interface RolePermission {
  action: { name: Action };
  subject: Subject;
  permission: Permission;
}

interface Role {
  name: string;
  permissions: RolePermission[];
}

export interface UserWithPermissions {
  id: number;
  email: string;
  Role: Role;
}

const defineAbility = (user: UserWithPermissions): AppAbility => {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  );

  user.Role.permissions.forEach((perm) => {
    const actionEnum =
      Action[perm.action.name.toUpperCase() as keyof typeof Action];

    if (actionEnum) {
      if (perm.permission === Permission.CAN) {
        can(actionEnum, perm.subject);
      } else if (perm.permission === Permission.CANNOT) {
        cannot(actionEnum, perm.subject);
      }
    } else {
      throw new Error(
        `Action ${perm.action.name} is not a valid action. Please check the enum Action`,
      );
    }
  });

  return build();
};

export default defineAbility;
