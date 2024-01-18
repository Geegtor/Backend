import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Album } from "./Album";
import { Artist } from "./Artist";
import { BaseEntity } from './BaseEntity';
import { Genre } from "./Genre";
import { User } from "./User";

@Entity()
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cover: string;
  
  @Column()
  title: string;
  
  @Column()
  duration: string;

  @Column()
  audio: string;

  @ManyToOne(() => Artist, (artist) => artist.tracks)
  artist: Artist;

  @ManyToOne(() => Album, (album) => album.tracks)
  album: Album;

  @ManyToOne(() => Genre, (genre) => genre.tracks)
  genre: Genre;

  @ManyToOne(() => User, (user) => user.tracks)
  user: User;
}