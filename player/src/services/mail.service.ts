import nodemailer, {SentMessageInfo} from 'nodemailer';
import {config} from 'dotenv';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

config();

class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: JSON.parse(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  public async sendVerificationLink(email: string): Promise<SentMessageInfo> {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Verification link',
        text: '',
        html: `
            <div>
              <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>
            <div>
          `,
      });
      return result;
    } catch (err) {}
  }

  public async sendResetLink(email: string, token: string): Promise<void | String> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Password reset link',
        text: '',
        html: `
            <div>
              <a href="${process.env.CLIENT_URL}"
              >${process.env.CLIENT_URL}
              /reset-password/
              ${token}</a>
            <div>
          `,
      });
    } catch (err) {
      throw err;
    }
  }
}

export default MailService;
