import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrevoService {
  private readonly logger = new Logger(BrevoService.name);
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY') || '';
    this.senderEmail =
      this.configService.get<string>('BREVO_SENDER_EMAIL') ||
      '4todiazyacsahuangaanthony@gmail.com';
    this.senderName =
      this.configService.get<string>('BREVO_SENDER_NAME') || 'AuraStation';
  }

  async sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    htmlContent: string,
  ): Promise<boolean> {
    if (!this.apiKey || this.apiKey.includes('placeholder')) {
      this.logger.warn(
        `Brevo API Key no configurada. Simulando envío a ${toEmail}`,
      );
      return true;
    }

    try {
      const payload = {
        sender: { name: this.senderName, email: this.senderEmail },
        to: [{ email: toEmail, name: toName }],
        subject,
        htmlContent,
      };

      this.logger.log(
        `Enviando correo a ${toEmail} desde ${this.senderEmail}...`,
      );

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.text();

      if (!response.ok) {
        this.logger.error(
          `Brevo API error (${response.status}): ${responseBody}`,
        );
        return false;
      }

      this.logger.log(
        `Correo enviado con éxito a ${toEmail} vía Brevo. Response: ${responseBody}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Excepción enviando correo a ${toEmail}:`,
        error,
      );
      return false;
    }
  }
}
