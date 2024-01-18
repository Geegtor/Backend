import {IRouter} from 'express';
import AuthService from '../services/auth.service';
import {
  emailVerificationMiddleware,
  phoneVerificationMiddleware,
  registerMiddleware,
  verificationCodeMiddleware,
} from '../helpers/validation';
import PhoneService from '../services/phone.service';

class AuthController {
  private authService: AuthService;

  private phoneService: PhoneService;

  constructor(private router: IRouter) {
    this.authService = new AuthService();
    this.phoneService = new PhoneService();
    this.routes();
  }

  public routes() {
    this.router.route('/register').post(registerMiddleware, this.authService.register);
    this.router
      .route('/email-verification')
      .post(emailVerificationMiddleware, this.authService.verificateByEmail);
    this.router
      .route('/phone-verification')
      .post(phoneVerificationMiddleware, this.authService.verificateByPhone);
    this.router
      .route('/code-verification')
      .post(verificationCodeMiddleware, this.phoneService.checkVerificationCode);
    this.router.route('/request-new-code').get(this.phoneService.requestNewVerificationCode);
  }
}

export default AuthController;

/**
* @swagger
* /api/v1/code-verification:
*   post:
*     tags:
*       - Users
*     summary: Verify created user by phone (Code was send to a provided number)
*     requestBody:
*       description: An phone we want to provide
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/verifyPhone'
*     produces:
*       - application/json
*     responses:
*       '200':
*         description: 'Succes: Phone has been confirmed'
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
*       '500':
*         description: 'Error: Internal Server Error'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/serverError'
* /api/v1/email-verification:
*   post:
*     tags:
*       - Users
*     summary: Verify created user by email (Link was send to a provided email)
*     requestBody:
*       description: An email we want to provide
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/verifyEmail'
*     produces:
*       - application/json
*     responses:
*       '200':
*         description: 'Success: Verification link was mailed to user'
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
*       '500':
*         description: 'Error: Internal Server Error'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/serverError'
* /api/v1/phone-verification:
*   post:
*     tags:
*       - Users
*     summary: Create a user by phone
*     requestBody:
*       description: An pnone number we want to provide
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/phone'
*     produces:
*       - application/json
*     responses:
*       '200':
*         description: 'Success: Verification code was sent to user'
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
*       '500':
*         description: 'Error: Internal Server Error'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/serverError'
* /api/v1/register:
*   post:
*     tags:
*       - Users
*     summary: Create a user
*     requestBody:
*       description: User data we want to provide
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/userDataRequest'
*     produces:
*       - application/json
*     responses:
*       '201':
*         description: 'Success: User has been created'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userDataResponse'
*       '400':
*         description: 'Error: Bad Request'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/error400'
*       '500':
*         description: 'Error: Internal Server Error'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/serverError'
* /api/v1/request-new-code:
*   get:
*     tags:
*       - Users
*     summary: Request new code
*     responses:
*       '200':
*         description: 'Success: Code has been sent to user'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/successRes'
*       '500':
*         description: 'Error: Internal Server Error'
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/serverError'
*/