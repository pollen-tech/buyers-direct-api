import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {ConfigService} from '@nestjs/config';
import {EmailAdminOnboardNotifyDto} from '../dto/email.dto';
import {AxiosRequestConfig} from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import {EMAIL_NOTIFICATION_PATH} from '../notify.constant';
import {firstValueFrom} from 'rxjs';

@Injectable()
export class EmailNotificationService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
    }

    async sendAdminOnboardNotifyEmailForDirect(message: EmailAdminOnboardNotifyDto) {
        message['email_type'] = 'EMAIL_ADMIN_FOR_NEW_ONBOARDED_IN_DIRECT';
        const response = await firstValueFrom(this.httpService.post(EMAIL_NOTIFICATION_PATH, message, this.createAxiosOptions()));
        return response.data;
    }

    async testSendWelcomeEmail(): Promise<any> {
        const response = await firstValueFrom(
            this.httpService.post(
                EMAIL_NOTIFICATION_PATH,
                {
                    email_type: 'TEST_EMAIL_SIGNUP_CONFIRMATION',
                },
                this.createAxiosOptions(),
            ),
        );
        return response.data;
    }

    private createAxiosOptions(): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.configService.get('EMAIL_NOTIFICATION_API_KEY'),
            },
        };
    }
}
