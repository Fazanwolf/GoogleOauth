import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis'
import { CoreConfigService } from 'src/core/modules/config/config.service';

@Injectable()
export class AuthService {
  private oauth2Client: any;

  constructor(
    private readonly configService: CoreConfigService,
    private readonly httpService: HttpService
  ) {
    const { clientId, clientSecret, callbackURI } = configService.google;
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, callbackURI[1]);
  }

  generateAuthUrlFromApi() {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.configService.google.scopes,
      include_incremental_scopes: true,
      redirect_uri: this.configService.google.callbackURI[1]
    })
  }

  generateAuthUrlForAxios() {
    return 
  }

  googleInfo(req: any) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async handleApi(query: any) {
    if (query.code) {
      const { tokens } = await this.oauth2Client.getToken(query.code);
      console.log(query, tokens.access_token);
      return tokens;
    } else {
      console.log("Error: " + query.error)
      return {
        error: "Cannot retrieve user info from the callback"
      }
    }
  }

  async getUserInfo(access_token: string) {
    const { data } = await this.httpService
      .axiosRef.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    return data;
  }

}
