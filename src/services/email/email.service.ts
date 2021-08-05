/* eslint-disable camelcase */
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { Service } from 'typedi';
import { SESService } from '@services/email/ses.service';
import SESTransport from 'nodemailer/lib/ses-transport';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpError } from 'routing-controllers';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

@Service()
export class EmailService {
  static buildSesTransport(): Transporter<SESTransport.SentMessageInfo> {
    const ses = SESService.createSES();
    return nodemailer.createTransport({
      SES: { ses, aws }
    });
  }

  static async sendEmail(email: SendEmailRequest) {
    try {
      const ses = SESService.createSES();
      nodemailer.createTransport({
        SES: { ses, aws }
      });

      const emailSent = await ses.sendEmail(email).promise();
      return emailSent;
    } catch (error) {
      throw new HttpError(502, ErrorsMessages.EMAIL_NOT_SENT);
    }
  }
}
