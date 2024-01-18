import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from '../entity/BaseEntity';

@Entity()
export class AuthVerification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  login: string;

  @Column({ nullable: true })
  verificationCode: string;
}