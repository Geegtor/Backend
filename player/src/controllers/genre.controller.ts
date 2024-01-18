import {IRouter} from 'express';
import {genreValidationMiddleware} from '../helpers/validation';
import GenreService from '../services/genre.service';

class GenreController {
  private GenreService;

  constructor(private router: IRouter) {
    this.GenreService = new GenreService();
    this.routes();
  }

  public routes() {
    this.router.route('/genre').get(this.GenreService.getAll);
    this.router.route('/genre').post(genreValidationMiddleware, this.GenreService.createGenre);
    this.router.route('/genre/:id').put(genreValidationMiddleware, this.GenreService.editGenre);
    this.router.route('/genre/:id').delete(this.GenreService.deleteGenre);
  }
}

export default GenreController;
