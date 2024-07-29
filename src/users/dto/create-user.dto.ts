import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  // @IsUnique(...) check my previous video on how to make such
  // custom validator as IsUnique doesn't exist in class-validator
  username: string;

  @IsString()
  // apply more rules for password as you see fit
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
