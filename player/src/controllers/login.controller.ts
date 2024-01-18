import {IRouter} from 'express';
import {
  resetMiddleware,
  loginMiddleware,
  passwordValidationMiddleware,
} from '../helpers/validation';
import LoginService from '../services/login.service';

class LoginController {
  private loginService: LoginService;

  constructor(private router: IRouter) {
    this.loginService = new LoginService();
    this.routes();
  }

  public routes() {
    this.router.route('/login').post(loginMiddleware, this.loginService.login);
    this.router.route('/reset-password').post(resetMiddleware, this.loginService.reset);
    this.router
      .route('/change-password/:verificationCode?')
      .post(passwordValidationMiddleware, this.loginService.change);
    this.router.route('/logout').delete(this.loginService.logout);
  }
}

export default LoginController;

/**
* @swagger
* /api/v1/login:
*   post:
*     tags:
*       - Users
*     summary: User login
*     requestBody:
*       description: An email and a password for login
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/login'
*     produces:
*       - application/json
*     responses:
*       '200':
*         description: 'Success: User has logged in'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/loginResult'
*       '401':
*         description: 'Error: Not Authorized'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error401'
*       '403':
*         description: 'Error: Forbidden'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error403'
* /api/v1/logout:
*   delete:
*     tags:
*       - Users
*     summary: Logout out user
*     responses:
*       '200':
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/successRes'
*       '403':
*         description: 'Error: Forbidden'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error403'
* /api/v1/reset-password:
*   post:
*     requestBody:
*       description: An email where to send a reset password link
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/email'
*     tags:
*       - Users
*     summary: Send resent password link to an email
*     responses:
*       '200':
*         description: 'Succes: Reset link was sent'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/successRes'
*       '401':
*         description: 'Error: Not Authorized'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error401'
*       '403':
*         description: 'Error: Fofbidden'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error403'
* /api/v1/change-password/{code}:
*   post:
*     parameters:
*       - in: path
*         name: code
*         description: verification code (optional)
*         type: string
*         required: false
*     requestBody:
*       description: Data required
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               password:
*                 type: string
*               passwordConfirmation:
*                 type: string
*               verificationCode:
*                 type: string
*                 required: false
*     tags:
*       - Users
*     summary: Change password
*     responses:
*       '200':
*         description: 'Success: Password updated'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/successRes'
*       '400':
*         description: 'Error: Bad Request'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error400'
*       '403':
*         description: 'Error: Forbidden'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error403'
*/