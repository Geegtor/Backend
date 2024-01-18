import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from './BaseEntity';
import { Track } from "./Track";
import { User } from "./User";

@Entity()
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cover: string;
  
  @Column()
  title: string;
  
  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.playlists, { onDelete: 'SET NULL' })
  user: User;

  @ManyToMany(() => Track, { onDelete: 'SET NULL' })
  @JoinTable()
  tracks: Track[];
}