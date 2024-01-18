import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {getRepository} from 'typeorm';
import {Playlist} from '../entity/Playlist';
import {User} from '../entity/User';
import FileService from './fileService';
import JWT from './tokens.service';

class PlaylistService {
  private TokenService: JWT;

  private fileService: FileService;

  constructor() {
    this.addPlaylist = this.addPlaylist.bind(this);
    this.TokenService = new JWT();
    this.fileService = new FileService();
  }

  public async addPlaylist(req: Request, res: Response): Promise<Response | void> {
    try {
      const {title, description, tracks} = req.body;
      const cover = req['file'];

      const [, token] = req.headers?.['authorization']?.split(' ');
      const {id: userId} = this.TokenService.decodeToken(token);

      const user: User = await getRepository(User).findOne({
        where: {id: userId},
      });

      if (!user) {
        this.fileService.deleteFile(cover.filename);
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'User is not found'});
      }

      const playlist: Playlist = await getRepository(Playlist).save({
        cover: cover.filename,
        title,
        description,
        user,
      });

      if (tracks) {
        const newTracks = JSON.parse(tracks);
        const reference = await getRepository(Playlist)
          .createQueryBuilder()
          .relation(Playlist, 'tracks')
          .of(playlist);
        await Promise.all(newTracks.map(id => reference.add(id)));
      }

      res.status(StatusCodes.CREATED).json({msg: 'Playlist has been saved'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }
}

export default PlaylistService;
