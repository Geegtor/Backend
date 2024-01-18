import {IRouter} from 'express';
import multerStorage from '../helpers/multer';
import {validateCover, validatePlaylistFields} from '../helpers/validation';
import PlaylistService from '../services/playlist.service';

class PlaylistController {
  private playlistService: PlaylistService;

  constructor(private router: IRouter) {
    this.playlistService = new PlaylistService();
    this.routes();
  }

  public routes() {
    this.router
      .route('/admin/playlist')
      .post(multerStorage.single('cover'), validateCover, validatePlaylistFields, this.playlistService.addPlaylist);

  }
}

export default PlaylistController;

/**
 * @swagger
 * api/v1/admin/playlist:
 *   post:
 *     summary: Create a playlist.
 *     tags:
 *        - Playlists
 *     description: Create a playlist with cover, title, description and tracks.
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              tracks:
 *                type: array
 *                items:
 *                  type: integer
 *              cover:
 *                type: string
 *                format: binary
 *     responses:
 *       201:
 *         description: Success. Playlist has been created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Succesfull message.
 *                   example: Playlist has been saved
 *       400:
 *         description: Error. Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     msg:
 *                        type: string
 *                        example: Must be 254 characters or less
 *       500:
 *         description: Error. Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Error
 */