import { User } from '@entities/user.entity';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

export class SignUpConfirmationEmail implements SendEmailRequest {
  Destination;
  Source = process.env.AWS_VERIFIED_EMAIL || '';
  Message;

  constructor(inactiveUser: User) {
    this.Message = {
      Subject: { Data: 'Activate your account!' },
      Body: {
        Text: {
          Data:
            'Please click on the following link to activate your account: \n' +
            `http://localhost:3000/api/v1/auth/${inactiveUser.id}/` +
            `${inactiveUser.activationCode}`
        }
      }
    };
    this.Destination = {
      ToAddresses: [inactiveUser.email]
    };
  }
}
