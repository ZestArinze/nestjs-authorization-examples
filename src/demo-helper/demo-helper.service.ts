import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../auth/entities/permission.entity';
import { Role } from '../auth/entities/role.entity';
import { ClientPermission } from '../auth/enums/permission.enum';
import { ClientRole } from '../auth/enums/role.enum';
import { AccountStatus } from '../users/enums/user.enums';
import { UsersService } from '../users/users.service';

@Injectable()
export class DemoHelperService {
  constructor(
    private usersService: UsersService,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async setUpForDemo() {
    // demo permissions
    const permissions = await this.createPermissions([
      ClientPermission.CreateUser,
      ClientPermission.ReadUser,
      ClientPermission.UpdateUser,
      ClientPermission.DeleteUser,

      ClientPermission.CreateAnnouncement,
      ClientPermission.UpdateAnnouncement,
    ]);

    // demo roles

    const [
      createClientPermission,
      readClientPermission,
      updateClientPermission,
      deleteClientPermission,
    ] = permissions;

    const adminRole = await this.createRole({
      name: ClientRole.Admin,
      rank: 0,
      permissions: [
        createClientPermission,
        readClientPermission,
        updateClientPermission,
        deleteClientPermission,
      ],
    });

    const editorRole = await this.createRole({
      name: ClientRole.Editor,
      rank: 1,
      permissions: [createClientPermission, readClientPermission],
    });

    const userRole = await this.createRole({
      name: ClientRole.User,
      rank: 999,
      permissions: [readClientPermission],
    });

    // demo users
    const admin = await this.usersService.create({
      username: 'johndoe',
      password: 'secret',
      name: 'John Doe',
    });
    this.usersService.update(admin.id, {
      roles: [adminRole, editorRole, userRole],
      permissions: permissions,
      accountStatus: AccountStatus.Active,
    });

    const editor = await this.usersService.create({
      username: 'lucywoo',
      password: 'secret',
      name: 'Lucy Woo',
    });
    this.usersService.update(editor.id, {
      roles: [editorRole, userRole],
      accountStatus: AccountStatus.Active,
    });

    const user = await this.usersService.create({
      username: 'zest',
      password: 'secret',
      name: 'Zest Made',
    });
    this.usersService.update(user.id, {
      roles: [userRole],
      accountStatus: AccountStatus.Active,
    });

    return {
      permissions,
      adminRole,
      editorRole,
      userRole,
      admin,
      editor,
      user,
    };
  }

  private async createPermissions(
    permissionNames: ClientPermission[],
  ): Promise<Permission[]> {
    return Promise.all(
      permissionNames.map(async (name) => {
        const permission = this.permissionRepository.create({ name });

        return this.permissionRepository.save(permission);
      }),
    );
  }

  private async createRole(data: {
    name: ClientRole;
    rank: number;
    permissions: Permission[];
  }) {
    const { name, rank, permissions } = data;
    const role = this.roleRepository.create({ name, rank });
    role.permissions = permissions;

    return await this.roleRepository.save(role);
  }
}
