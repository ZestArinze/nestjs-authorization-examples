import { SetMetadata } from '@nestjs/common';
import { ClientRole } from '../enums/role.enum';

export const ROLES_METEDATA_KEY = 'roles_decorator_key';

export const Roles = (...roles: ClientRole[]) =>
  SetMetadata(ROLES_METEDATA_KEY, roles);
