import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Action } from '../auth/enums/actions.enum';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { FindUsersDto } from './dto/find-users.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  // @Roles(ClientRole.Admin, ClientRole.Editor)
  // @Permissions(ClientPermission.CreateAnnouncement)
  findMany(@Query() query: FindUsersDto, @CurrentUser() user: User) {
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!ability.can(Action.Read, 'all')) {
      throw new ForbiddenException(`Permission denied`);
    }

    return this.usersService.findMany(query);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Put('/:id')
  async updateProfile(@CurrentUser() user: User, @Param('id') id: string) {
    const ability = this.caslAbilityFactory.createForUser(user);

    // const someUser: User = {
    //   id: +id,
    //   username: 'whatever',
    //   accountStatus: AccountStatus.Active,
    // };

    const someUser = new User();
    someUser.id = +id;

    if (!ability.can(Action.UpdateOwn, someUser)) {
      throw new ForbiddenException(`Permission denied`);
    }

    return someUser;
  }
}
