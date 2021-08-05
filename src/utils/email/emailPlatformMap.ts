import { EmailService } from '@services/email/email.service';
import { EmailInterface } from '@interfaces';

export const transporterMapper: EmailInterface.TransporterMapper = {
  // SENDGRID: EmailService.buildSendGridTransport,
  SES: EmailService.buildSesTransport
};
