import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false, length: 255 })
  email!: string;

  @Column({ nullable: false, length: 255 })
  password!: string;

  @Column({ nullable: true, length: 255 })
  recoveryToken!: string;

  @Column({ nullable: true, length: 255 })
  recoveryTokenExpiration!: string;

  @Column({ nullable: false, length: 255 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
