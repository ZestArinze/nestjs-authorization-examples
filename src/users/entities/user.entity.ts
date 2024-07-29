import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../auth/entities/permission.entity';
import { Role } from '../../auth/entities/role.entity';
import { AccountStatus } from '../enums/user.enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: AccountStatus.Inactive })
  accountStatus: AccountStatus;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles?: Role[];

  // Ability to also directly assign permissions to user
  // means more flexibility with potentially more complexity
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];
}
