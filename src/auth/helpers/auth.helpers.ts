import { User } from '../../users/entities/user.entity';
import { ClientRole } from '../enums/role.enum';

export function getClientPermissions(user: Partial<User>): Set<string> {
  // Extract all permissions from the user's roles
  const rolePermissions = new Set<string>(
    (user.roles ?? []).flatMap((role) =>
      (role.permissions ?? []).map((permission) => permission.name),
    ),
  );

  // Extract all directly assigned permissions
  const directPermissions = new Set<string>(
    (user.permissions ?? []).map((permission) => permission.name),
  );

  // Combine both sets of permissions
  return new Set<string>([...rolePermissions, ...directPermissions]);
}

export const userHasAnyRole = (user: User, roles: ClientRole[]) => {
  return user.roles?.some((role) => roles.includes(role.name));
};
