import fs from 'fs';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {getConnection, getRepository} from 'typeorm';
import {Album} from '../entity/Album';
import {Artist} from '../entity/Artist';
import {Genre} from '../entity/Genre';
import {Track} from '../entity/Track';
import {User} from '../entity/User';
import {trackHeaders} from '../helpers/headers';
import JWT from './tokens.service';
import FileService from './fileService';

class TrackService {
  private FileService: FileService;

  private JWT: JWT;

  constructor() {
    this.addTrack = this.addTrack.bind(this);
    this.getAllTracks = this.getAllTracks.bind(this);
    this.updateTrack = this.updateTrack.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.getTrack = this.getTrack.bind(this);
    this.FileService = new FileService();
    this.JWT = new JWT();
  }

  public async addTrack(req: Request, res: Response): Promise<Response | void> {
    try {
      const {title, artistId, albumId, genreId, duration, cover, audio} = req.body;

      const [, token] = req.headers?.['authorization']?.split(' ');
      const {id: userId} = this.JWT.decodeToken(token);

      const artist: Artist = await getRepository(Artist).findOne({
        where: {id: artistId},
      });

      if (!artist) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Artist is not found'});
      }

      const album: Album = await getRepository(Album).findOne({
        where: {id: albumId},
      });

      if (!album) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Album is not found'});
      }

      const genre: Genre = await getRepository(Genre).findOne({
        where: {id: genreId},
      });

      if (!genre) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Genre is not found'});
      }

      const user: User = await getRepository(User).findOne({
        where: {id: userId},
      });

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'User is not found'});
      }

      await getRepository(Track).save({
        title,
        cover,
        duration,
        audio,
        artist,
        album,
        genre,
        user,
      });

      res.status(StatusCodes.CREATED).json({msg: 'Track has been saved'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async getAllTracks(req: Request, res: Response): Promise<void> {
    try {
      const tracks: Track[] = await getRepository(Track)
        .createQueryBuilder('track')
        .select([
          'track.id',
          'track.title',
          'track.cover',
          'track.duration',
          'track.audio',
          'artist.name',
          'album.title',
          'genre.name',
        ])
        .leftJoin('track.artist', 'artist')
        .leftJoin('track.album', 'album')
        .leftJoin('track.genre', 'genre')
        .getMany();
      res.status(StatusCodes.OK).json(tracks);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async getTrack(req: Request, res: Response): Promise<Response | void> {
    try {
      const filePath = req.params?.path;

      const track: Track = await getRepository(Track).findOne({
        where: {audio: filePath},
      });

      if (!track) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Track is not found'});
      }
      const path = `static/${filePath}`;
      const stat = fs.statSync(path);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const file = fs.createReadStream(path, {start, end});

        trackHeaders(req, res, fileSize);
        file.pipe(res);
      } else {
        trackHeaders(req, res, fileSize);
        fs.createReadStream(path).pipe(res);
      }
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async updateTrack(req: Request, res: Response): Promise<Response | void> {
    try {
      const {id} = req.params;
      const {title, artistId, albumId, genreId, cover, duration, audio} = req.body;

      const track: Track = await getRepository(Track).findOne(id);

      if (!track) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Track is not found'});
      }

      const artist: Artist = await getRepository(Artist).findOne({
        where: {id: artistId},
      });

      if (!artist) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Artist is not found'});
      }

      const album: Album = await getRepository(Album).findOne({
        where: {id: albumId},
      });

      if (!album) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Album is not found'});
      }

      const genre: Genre = await getRepository(Genre).findOne({
        where: {id: genreId},
      });

      if (!genre) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Genre is not found'});
      }

      const {cover: oldCover, audio: oldAudio} = track;

      this.FileService.deleteFile(oldCover);
      this.FileService.deleteFile(oldAudio);

      await getConnection()
        .createQueryBuilder()
        .update(Track)
        .set({
          title,
          cover,
          duration,
          audio,
          artist,
          album,
          genre,
        })
        .where('id = :id', {id})
        .execute();

      return res.status(StatusCodes.OK).json({msg: 'Track has been updated'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async deleteTrack(req: Request, res: Response): Promise<Response | void> {
    try {
      const {id} = req.params;
      const track: Track = await getRepository(Track).findOne(id);

      if (!track) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Track is not found'});
      }

      const {cover, audio} = track;

      this.FileService.deleteFile(cover);
      this.FileService.deleteFile(audio);

      await getRepository(Track).delete(id);
      return res.status(StatusCodes.OK).json({msg: 'Track has been deleted'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }
}

export default TrackService;
