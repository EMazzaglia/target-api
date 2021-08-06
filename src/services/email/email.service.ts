/* eslint-disable camelcase */
import aws from 'aws-sdk';
import { Service } from 'typedi';
import { ErrorsMessages } from '@constants/errorMessages';
import { HttpError } from 'routing-controllers';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { AWS_ID, AWS_REGION, AWS_SECRET, SES_API_VERSION } from '@config';

aws.config.update({
  accessKeyId: AWS_ID as string,
  secretAccessKey: AWS_SECRET as string
});
@Service()
export class EmailService {
  ses: aws.SES;

  constructor() {
    this.ses = new aws.SES({
      apiVersion: SES_API_VERSION as string,
      region: AWS_REGION as string
    });
  }

  async sendEmail(email: SendEmailRequest) {
    try {
      const emailSent = await this.ses.sendEmail(email).promise();
      return emailSent;
    } catch (error) {
      throw new HttpError(502, ErrorsMessages.EMAIL_NOT_SENT);
    }
  }
}
