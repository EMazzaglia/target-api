import { APP_NAME, BASE_URL, ROUTE_PREFIX } from '@config';
import { Endpoints } from '@constants/endpoints';
import { User } from '@entities/user.entity';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

export class SignUpConfirmationEmail implements SendEmailRequest {
  Destination;
  Source = process.env.AWS_VERIFIED_EMAIL || '';
  Message;

  constructor(inactiveUser: User) {
    this.Message = {
      Subject: { Data: `${APP_NAME} | Activation link` },
      Body: {
        Text: {
          Data:
            'Please click on the following link to activate your account: \n' +
            `http://${BASE_URL}${ROUTE_PREFIX}${Endpoints.AUTH}/${inactiveUser.id}/` +
            `${inactiveUser.activationCode}`
        }
      }
    };
    this.Destination = {
      ToAddresses: [inactiveUser.email]
    };
  }
}
