import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from './BaseEntity';
import { Track } from "./Track";

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  color: string;

  @OneToMany(() => Track, (track) => track.genre)
  tracks: Track[];
}