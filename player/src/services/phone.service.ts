import {Request, Response} from 'express';
import crypto from 'crypto';
import {getRepository} from 'typeorm';
import {StatusCodes} from 'http-status-codes';
import {AuthVerification} from '../entity/AuthVerification';

class PhoneService {
  constructor() {
    this.checkVerificationCode = this.checkVerificationCode.bind(this);
    this.requestNewVerificationCode = this.requestNewVerificationCode.bind(this);
  }

  public async checkVerificationCode(req: Request, res: Response): Promise<Response | void> {
    try {
      const {verificationCode} = req.body;
      const savedVerificationCode: AuthVerification = await getRepository(AuthVerification).findOne(
        {verificationCode}
      );

      if (!savedVerificationCode) {
        return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Invalid code'});
      }

      await getRepository(AuthVerification).delete({verificationCode});
      res.status(StatusCodes.OK).json({msg: 'code is verificated successfully'});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public async requestNewVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const generatedCode: string = this.generateVerificationCode();

      await getRepository(AuthVerification).save({
        verificationCode: generatedCode,
      });

      res.status(StatusCodes.OK).json({msg: generatedCode});
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
    }
  }

  public generateVerificationCode(): string {
    return crypto.randomBytes(2).toString('hex');
  }
}

export default PhoneService;
