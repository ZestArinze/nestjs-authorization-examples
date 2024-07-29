import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientPermission } from '../enums/permission.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: ClientPermission;
}
