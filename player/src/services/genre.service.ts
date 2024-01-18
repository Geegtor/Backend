import {Response, Request} from 'express';
import {getRepository} from 'typeorm';
import {StatusCodes} from 'http-status-codes';
import {Genre} from '../entity/Genre';

class GenreService {
  constructor() {
    this.createGenre = this.createGenre.bind(this);
    this.editGenre = this.editGenre.bind(this);
    this.deleteGenre = this.deleteGenre.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const allGenres = await getRepository(Genre).find();

      res.status(StatusCodes.OK).json(allGenres);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
  };

  public createGenre = async (req: Request, res: Response) => {
    try {
      const {name, color} = req.body;

      const genre = await getRepository(Genre).findOne({
        name,
      });

      if (genre) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'This genre is already exists.'});
      }

      const newGenre: Genre = await getRepository(Genre).save({name, color});
      res.status(StatusCodes.CREATED).json(newGenre);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
  };

  public editGenre = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const genre = await getRepository(Genre).findOne(id);
      if (!genre) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: "This genre doesn't exist"});
      }
      const {name, color} = req.body;

      await getRepository(Genre).update(id, {name, color});
      const updateGenre = await getRepository(Genre).findOne(id);
      res.json(updateGenre);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
  };

  public deleteGenre = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      const genre = await getRepository(Genre).findOne(id);
      if (!genre) {
        return res.status(StatusCodes.NOT_FOUND).json({msg: "This genre doesn't exist"});
      }
      await getRepository(Genre).delete(id);
      res.status(StatusCodes.OK).json({msg: 'Genre successfully deleted'});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
  };
}

export default GenreService;
