import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Album } from "./Album";
import { BaseEntity } from './BaseEntity';
import { Track } from "./Track";

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;
  
  @Column()
  name: string;
  
  @Column()
  description: string;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}