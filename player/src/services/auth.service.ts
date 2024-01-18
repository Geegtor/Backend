import {Request, Response} from 'express';
import crypto from 'crypto';
import {getRepository} from 'typeorm';
import {StatusCodes} from 'http-status-codes';
import {User} from '../entity/User';
import MailService from './mail.service';
import PhoneService from './phone.service';
import {AuthVerification} from '../entity/AuthVerification';

class AuthService {
  private mailService: MailService;

  private phoneService: PhoneService;

  constructor() {
    this.register = this.register.bind(this);
    this.verificateByEmail = this.verificateByEmail.bind(this);
    this.verificateByPhone = this.verificateByPhone.bind(this);
    this.mailService = new MailService();
    this.phoneService = new PhoneService();
  }

  public async register(req: Request, res: Response): Promise<void | Response> {
    try {
      const {firstName, lastName, userName, email, phone, password} = req.body;
      const candidate = await getRepository(User).findOne({email});
      if (candidate) {
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'E-mail is already registered'});
      }

      const candidateByPhone: User = await getRepository(User).findOne({
        phone,
      });

      if (candidateByPhone) {
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'Phone is already registered'});
      }

      const hashedPassword: string = this.hashPassword(password);
      const user: User = await getRepository(User).save({
        firstName,
        lastName,
        userName,
        email,
        phone,
        password: hashedPassword,
      });
      res.status(StatusCodes.CREATED).json(user);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async verificateByEmail(req: Request, res: Response): Promise<Response | void> {
    try {
      const {email} = req.body;
      const candidate: User = await getRepository(User).findOne({email});
      if (candidate) {
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'E-mail is already registered'});
      }

      const isSend = await this.mailService.sendVerificationLink(email);
      if (isSend) {
        return res.status(StatusCodes.OK).json({
          msg: `Verification link has been sent to ${email}. Please follow it to continue`,
        });
      }
      res.status(StatusCodes.SERVICE_UNAVAILABLE).json({msg: 'Failed to send verification link'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async verificateByPhone(req: Request, res: Response): Promise<Response | void> {
    try {
      const {phone} = req.body;
      const candidate: User = await getRepository(User).findOne({phone});

      if (candidate) {
        return res.status(StatusCodes.BAD_REQUEST).json({exists: 'Phone is already registered'});
      }

      const generatedCode: string = this.phoneService.generateVerificationCode();

      await getRepository(AuthVerification).save({
        verificationCode: generatedCode,
      });
      res.status(StatusCodes.OK).json({msg: generatedCode});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('base64');
  }
}

export default AuthService;
