import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { UserService } from '../domain/user.service';
import { ChannelNewUsersDto, PasswordLessNewUsersDto } from '../dto/users.dto';
import { ChannelName } from '../../../common/enums/common.enum';

@Injectable()
export class Auth0Service {
    constructor(
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    get clientId() {
        return this.configService.get<string>('AUTH0_CLIENT_ID');
    }

    get clientSecret() {
        return this.configService.get<string>('AUTH0_CLIENT_SECRET');
    }

    async sendPasswordLessOtpToEmail(email: string) {
        let data = JSON.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            connection: 'email',
            email: email,
            send: 'code',
        });

        let config = {
            method: 'post',
            url: 'https://pollen-pass-dev.us.auth0.com/passwordless/start',
            headers: { 'Content-Type': 'application/json' },
            data: data,
        };

        let response = await axios(config).catch(function (error) {
            console.log('Auth0 Error ', error);
            return {
                data: {
                    status_code: 'LOGIN_ERROR',
                    desc: 'Contact Support team',
                },
            };
        });
        return response.data;
    }

    async verifyPasswordLessOfEmail(email: string, code: string) {
        let data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            connection: 'email',
            email: email,
            grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
            otp: code,
            realm: 'email',
            username: email,
            audience: 'pollen-pass',
            scope: 'id email profile openid',
            redirect_uri: 'http://localhost:3000',
        };

        let config = {
            method: 'post',
            url: 'https://pollen-pass-dev.us.auth0.com/oauth/token',
            headers: { 'Content-Type': 'application/json' },
            data: data,
        };

        let response = await axios(config).catch(function (error) {
            console.log('Auth0 Error ', error);
            return {
                data: {
                    status_code: 'LOGIN_ERROR',
                    desc: 'Contact Support team',
                },
            };
        });

        return response.data;
    }

    async validateOtpAndCreateUser(email: string, code: string, channel_code: ChannelName) {
        let auth0_res_data = await this.verifyPasswordLessOfEmail(email, code);
        if (auth0_res_data.token_type) {
            let access_token = auth0_res_data.access_token;
            let { sub_id, auth_id } = this.getUsernameFromToken(access_token);
            let user_dto = new ChannelNewUsersDto();
            user_dto.auth_id = auth_id;
            user_dto.auth_ref_id = sub_id;
            user_dto.channel = channel_code;
            user_dto.email = email;
            /* after successful, create the user in db, and set the user_id filed into response for FE usages */
            let { user_id, pollen_pass_id, phone_verified } = await this.userService.createOrUpdateWhenChannelOnboard(user_dto);
            auth0_res_data['user_id'] = user_id;
            auth0_res_data['phone_verified'] = phone_verified;
            auth0_res_data['pollen_pass_id'] = pollen_pass_id;
            return auth0_res_data;
        }
        return auth0_res_data;
    }

    async validateOtpAndCreatePollenPassUser(email: string, code: string, first_name: string, last_name: string) {
        let auth0_res_data = await this.verifyPasswordLessOfEmail(email, code);
        if (auth0_res_data.token_type) {
            let access_token = auth0_res_data.access_token;
            let { sub_id, auth_id } = this.getUsernameFromToken(access_token);
            let user_dto = new PasswordLessNewUsersDto();
            user_dto.auth_id = auth_id;
            user_dto.auth_ref_id = sub_id;
            user_dto.channel = ChannelName.POLLEN_PASS;
            user_dto.email = email;
            user_dto.last_name = last_name;
            user_dto.first_name = first_name;
            /* after successful, create the user in db, and set the user_id filed into response for FE usages */
            let { user_id, pollen_pass_id, phone_verified } = await this.userService.createOrUpdateWhenPollenPassChannel(user_dto);
            auth0_res_data['user_id'] = user_id;
            auth0_res_data['phone_verified'] = phone_verified;
            auth0_res_data['pollen_pass_id'] = pollen_pass_id;
            return auth0_res_data;
        }
        return auth0_res_data;
    }

    getUsernameFromToken(token: string) {
        try {
            const decodedToken = jwt.decode(token, { complete: true });
            console.log(decodedToken.payload);
            let sub_id = decodedToken.payload.sub.toString();
            let auth_id = sub_id.substring(sub_id.indexOf('|') + 1);
            return { sub_id, auth_id };
        } catch (error) {
            console.error('Error decoding JWT:', error);
            return null;
        }
    }
}
