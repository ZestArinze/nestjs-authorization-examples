import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../../auth/entities/role.entity';
import { AccountStatus } from '../enums/user.enums';
import { CreateUserDto } from './create-user.dto';
import { Permission } from '../../auth/entities/permission.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  roles?: Role[];
  permissions?: Permission[];
  accountStatus?: AccountStatus;
}
