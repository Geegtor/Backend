import express, {IRouter, Application} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import specs from '../utils/swagger';
import {headersMiddleware} from '../helpers/headers';
import ExampleController from '../controllers/example.controller';
import AuthController from '../controllers/auth.controller';
import LoginController from '../controllers/login.controller';
import AdminController from '../controllers/admin.controller';
import TrackController from '../controllers/track.controller';
import GenreController from '../controllers/genre.controller';
import PlaylistController from '../controllers/playlist.controller';

class App {
  public app: Application;

  public router: IRouter;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.set_config();
    new ExampleController(this.router);
    new AuthController(this.router);
    new LoginController(this.router);
    new AdminController(this.router);
    new TrackController(this.router);
    new GenreController(this.router);
    new PlaylistController(this.router);
  }

  private set_config() {
    this.app.use(bodyParser.json({limit: '50mb'}));
    this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    this.app.use(cors());
    this.app.use(express.static('static'));
    this.app.use(headersMiddleware);
    this.app.use('/api/v1', this.router);
    this.app.use('/swagger', swaggerUI.serve, swaggerUI.setup(specs));
  }
}

export default new App().app;

/**
 * @swagger
 * tags:       
 *  - name: Users
 *    description: API for operations with users in the system
 *  - name: Artists
 *    description: API for operations with artists in the system
 *  - name: Genres
 *    description: API for operations with genres in the system
 *  - name: Albums
 *    description: API for operations with albums in the system
 *  - name: Search
 *    description: API for operations with search field in the system
 *  - name: Playlists
 *    description: API for operations with playlists in the system
 * components:
 *  schemas:
 *    email:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          default: user@mail.com
 *    phone:
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 *          default: '+35814564156'
 *    successRes:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *    error400:
 *      type: object
 *      properties:
 *        exists:
 *          type: string
 *    error401:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *    error403:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *    serverError:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *    login:
 *      type: object
 *      properties:
 *        login:
 *          type: string
 *          format: email
 *          required: true
 *        password:
 *          type: string
 *          required: true
 *    loginResult:
 *      type: object
 *      properties:
 *        expiresIn:
 *          type: number
 *          default: 16716515645
 *        token:
 *          type: string
 *    verifyEmail:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          required: true
 *    verifyPhone:
 *      type: object
 *      properties:
 *        verificationCode:
 *          type: string
 *          default: 7a4c
 *    userDataRequest:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *          required: true
 *        lastName:
 *          type: string
 *          required: true
 *        userName:
 *          type: string
 *          required: true
 *        email:
 *          type: string
 *          required: true
 *        phone:
 *          type: string
 *          required: false
 *        password:
 *          type: string
 *          required: true
 *        passwordConfirmation:
 *          type: string
 *          required: true
 *    userDataResponse:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        phone:
 *          type: string
 *        password:
 *          type: string
 */