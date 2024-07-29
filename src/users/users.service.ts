import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const { username, password, name } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      name,
    });

    const newUser = await this.usersRepository.save(user);

    delete (newUser as Partial<User>).password;

    return newUser;
  }

  async findMany(dto: FindUsersDto) {
    // const query: Partial<User> = {};
    // return this.usersRepository.find();
    return this.usersRepository.createQueryBuilder('user').getMany();
  }

  async findOne(
    username: string,
    selectSecrets: boolean = false,
  ): Promise<User | null> {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'rolePermission')
      .leftJoinAndSelect('user.permissions', 'permission');

    if (selectSecrets) {
      query.addSelect('user.password');
    }

    return await query.getOne();
  }

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException();
    }

    const { roles, permissions, accountStatus } = dto;

    user.roles = roles ?? user.roles;
    user.permissions = permissions ?? user.permissions;
    user.accountStatus = accountStatus ?? user.accountStatus;

    return await this.usersRepository.save(user);
  }
}
