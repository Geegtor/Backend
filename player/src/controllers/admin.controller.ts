import {IRouter} from 'express';
import {authMiddleware, validateArtistFields, validateCover} from '../helpers/validation';
import multerStorage from "../helpers/multer";
import AdminService from '../services/admin.service';

class AdminController {
  private adminService: AdminService;

  constructor(private router: IRouter) {
    this.adminService = new AdminService();
    this.routes();
  }

  public routes() {
    this.router.route('/artists').get(authMiddleware, this.adminService.viewArtists);
    this.router
      .route('/artists/add')
      .post(authMiddleware, multerStorage.single('photo'), validateArtistFields, validateCover, this.adminService.addArtist);
    this.router
      .route('/artists/edit')
      .patch(authMiddleware, multerStorage.single('photo'), validateArtistFields, validateCover, this.adminService.updateArtist);
    this.router.route('/artists/delete').delete(authMiddleware, this.adminService.deleteArtist);
  }
}

export default AdminController;

/**
 * @swagger
 * api/v1/artists:
 *   get:
 *     summary: Get all artists.
 *     tags:
 *        - Artists
 *     description: Get artists array.
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   photo:
 *                     type: string
 *                     example: string
 *                   description:
 *                     type: string
 *                     example: string
 *                   name:
 *                     type: string
 *                     example: string
 *                   created_at:
 *                     type: string
 *                     example: string
 *                   updated_at:
 *                     type: string
 *                     example: string
 *                   id:
 *                     type: integer
 *                     example: integer
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
 *                        example: string
 *       500:
 *         description: Error. Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: string
 * api/v1/artists/add:
 *   post:
 *     summary: Create an artist.
 *     tags:
 *        - Artists
 *     description: Create an artists with photo, name, description.
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              photo:
 *                type: string
 *                format: binary
 *     responses:
 *       201:
 *         description: Success. Artist has been created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photo:
 *                   type: string
 *                   example: string
 *                 description:
 *                   type: string
 *                   example: string
 *                 name:
 *                   type: string
 *                   example: string
 *                 created_at:
 *                   type: string
 *                   example: string
 *                 updated_at:
 *                   type: string
 *                   example: string
 *                 id:
 *                   type: integer
 *                   example: integer
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
 *                        example: string
 *       500:
 *         description: Error. Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: string
 * api/v1/artists/edit:
 *   patch:
 *     summary: Edit an artist.
 *     tags:
 *        - Artists
 *     description: Edit an artists with photo, name, description.
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              photo:
 *                type: string
 *                format: binary
 *     responses:
 *       201:
 *         description: Success. Artist has been updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 photo:
 *                   type: string
 *                   example: string
 *                 description:
 *                   type: string
 *                   example: string
 *                 name:
 *                   type: string
 *                   example: string
 *                 created_at:
 *                   type: string
 *                   example: string
 *                 updated_at:
 *                   type: string
 *                   example: string
 *                 id:
 *                   type: integer
 *                   example: integer
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
 *                        example: string
 *       500:
 *         description: Error. Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: string
 * api/v1/artists/delete:
 *   delete:
 *     summary: Delete an artist.
 *     tags:
 *        - Artists
 *     description: Delete an artist by name.
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *     responses:
 *       202:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: string
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
 *                        example: string
 *       500:
 *         description: Error. Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: string
 */