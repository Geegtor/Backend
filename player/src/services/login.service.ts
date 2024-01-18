import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {StatusCodes} from 'http-status-codes';
import {User} from '../entity/User';
import {hashPassword} from '../helpers/validation';
import JWT from './tokens.service';
import ResetPassword from './reset.service';
import {AuthVerification} from '../entity/AuthVerification';

class LoginService {
  private tokenService: JWT;

  private passwordReset: ResetPassword;

  constructor() {
    this.login = this.login.bind(this);
    this.reset = this.reset.bind(this);
    this.logout = this.logout.bind(this);
    this.tokenService = new JWT();
    this.passwordReset = new ResetPassword();
  }

  public login = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const {login, password} = req.body;

      const requester: User = await getRepository(User).findOne({
        where: [{email: login}, {phone: login}],
      });
      if (!requester)
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Login is incorrect'});

      const validPassword = (await hashPassword(password)) === requester.password;
      requester.password = undefined;
      if (!validPassword)
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Incorrect password'});

      const tokenData = this.tokenService.createToken(requester);
      res.cookie('Authorization', tokenData.token, {httpOnly: true});
      res.status(StatusCodes.OK).json(tokenData);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  };

  public reset = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const {login} = req?.body;
      const [miliSec, min] = [1000, 60];
      const requester: User = await getRepository(User).findOne({
        where: [{email: login}, {phone: login}],
      });

      if (!requester)
        return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Login is incorrect'});
      let reqAuth = await getRepository(AuthVerification).findOne({
        login: requester.email,
      });
      if (!reqAuth)
        await getRepository(AuthVerification).save({
          login: requester.email,
          updated_at: new Date(new Date().getTime() - miliSec * min),
        });
      reqAuth = await getRepository(AuthVerification).findOne({
        login: requester.email,
      });

      if ((new Date().getTime() - reqAuth.updated_at.getTime()) / miliSec <= min)
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({error: 'Too soon to request password restoration'});

      const verificationCode = await this.passwordReset.resetRequest(requester, login);
      res.status(StatusCodes.OK).json(verificationCode);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  };

  public change = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const token = await getRepository(AuthVerification).findOne({
        verificationCode: req.params.verificationCode || req.body.verificationCode,
      });

      if (!token)
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Invalid or expired link.'});

      await this.passwordReset.changePassword(token, req.body.password);
      res.sendStatus(StatusCodes.OK).json({msg: 'Password has been updated successfully'});
      return;
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  };

  public logout = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      res.cookie('Authorization', '');
      res.status(StatusCodes.OK).json({msg: 'Authorization cookie deleted'});
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({msg: err.message});
    }
  };
}

export default LoginService;
