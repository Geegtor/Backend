import crypto from 'crypto';
import {getRepository} from 'typeorm';
import {User} from '../entity/User';
import {AuthVerification} from '../entity/AuthVerification';
import {hashPassword} from '../helpers/validation';
import MailService from './mail.service';

class ResetPassword {
  private mailService: MailService;

  constructor() {
    this.resetRequest = this.resetRequest.bind(this);
    this.mailService = new MailService();
  }

  public async resetRequest(user: User, auth: string) {
    try {
      const isPhone: boolean = /^\+{1}\d+$/.test(auth);
      let generatedCode: string = this.generateVerificationCode(isPhone);

      let requester: AuthVerification = await getRepository(AuthVerification).findOne({
        login: user.email,
      });

      await getRepository(AuthVerification).update(requester.id, {verificationCode: generatedCode});

      if (!isPhone) this.mailService.sendResetLink(user.email, generatedCode);

      return {
        forLogin: auth,
        verificationCode: generatedCode,
      };
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(token: AuthVerification, newPass: string) {
    try {
      const requester = await getRepository(User).findOne({email: token.login});

      if (!requester) return new Error('404');

      await getRepository(User).update(requester.id, {
        password: hashPassword(newPass),
      });

      await getRepository(AuthVerification).update(requester.id, {
        verificationCode: undefined,
      });
    } catch (err) {
      console.warn({error: err});
    }
  }

  public generateVerificationCode(flag: boolean): string {
    return flag ? crypto.randomBytes(2).toString('hex') : crypto.randomBytes(16).toString('hex');
  }
}

export default ResetPassword;
