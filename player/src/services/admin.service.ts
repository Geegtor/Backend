import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import FileService from './fileService';
import {Artist} from '../entity/Artist';

class AdminService {
  private fileService: FileService;

  constructor() {
    this.viewArtists = this.viewArtists.bind(this);
    this.addArtist = this.addArtist.bind(this);
    this.updateArtist = this.updateArtist.bind(this);
    this.deleteArtist = this.deleteArtist.bind(this);
    this.fileService = new FileService();
  }

  public async viewArtists(req: Request, res: Response): Promise<void | Response> {
    try {
      const artistsList = await getRepository(Artist).find();
      res.json(artistsList);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  }

  public async addArtist(req: Request, res: Response): Promise<void | Response> {
    try {
      const {name, description} = req.body;
      const photo = req['file'];

      const sample: Artist = await getRepository(Artist).findOne({name});

      if (sample) {
        this.fileService.deleteFile(photo.filename);
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'Artist already exists'});
      }

      const artist: Artist = await getRepository(Artist).save({
        photo: photo.filename,
        description,
        name,
      });

      res.status(StatusCodes.CREATED).json(artist);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  }

  public async updateArtist(req: Request, res: Response): Promise<void | Response> {
    try {
      const {id, name, description} = req.body;
      const photo = req['file'];

      const sample: Artist = await getRepository(Artist).findOne({id});
      if (!sample) {
        this.fileService.deleteFile(photo.filename);
        return res.status(StatusCodes.BAD_REQUEST).json({message: 'ID not found'});
      }
      this.fileService.deleteFile(sample.photo);
      await getRepository(Artist).update(id, {
        photo: photo.filename,
        description,
        name,
      });

      res.status(StatusCodes.ACCEPTED).json({
        id,
        photo: photo.filename,
        description,
        name,
      });
    } catch (e) {
      res.status(StatusCodes.BAD_REQUEST).json({message: e.message});
    }
  }

  public async deleteArtist(req: Request, res: Response): Promise<void | Response> {
    try {
      const name = req.body.name;

      const sample: Artist = await getRepository(Artist).findOne({name});

      if (!sample) {
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'Artist is not exist'});
      }

      await getRepository(Artist).remove(sample);

      res.status(StatusCodes.ACCEPTED).send(this.fileService.deleteFile(sample.photo));
    } catch (e) {
      res.status(StatusCodes.FORBIDDEN).json({msg: e.message});
    }
  }
}

export default AdminService;
