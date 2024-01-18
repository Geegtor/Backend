import {IRouter} from 'express';
import TrackService from '../services/track.service';
import multerStorage from '../helpers/multer';
import {getDuration, getFilePath} from '../helpers/trackHelpers';
import {validateTrack, validateCover} from '../helpers/validation';

class TrackController {
  private trackService: TrackService;

  constructor(private router: IRouter) {
    this.trackService = new TrackService();
    this.routes();
  }

  public routes() {
    this.router
      .route('/admin/tracks')
      .post(
        multerStorage.fields([
          {name: 'audio', maxCount: 1},
          {name: 'cover', maxCount: 1},
        ]),

        validateTrack,
        validateCover,
        getDuration,
        getFilePath,
        this.trackService.addTrack
      )
      .get(this.trackService.getAllTracks);
    this.router
      .route('/admin/tracks/:id')
      .put(
        multerStorage.fields([
          {name: 'audio', maxCount: 1},
          {name: 'cover', maxCount: 1},
        ]),
        validateTrack,
        validateCover,
        getDuration,
        getFilePath,
        this.trackService.updateTrack
      )
      .delete(this.trackService.deleteTrack);
    this.router.route('/admin/tracks/:path').get(this.trackService.getTrack);
  }
}

export default TrackController;
