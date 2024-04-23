import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from "../auth.service";
import { CoreConfigService } from "../../core/modules/config/config.service";
import { version } from 'punycode';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: CoreConfigService,
  ) {
    const { clientId, clientSecret, callbackURI  } = configService.google;
    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURI[0],
      scope: ['profile', 'email'],
      passReqToCallback: true,
      accessType: 'offline'
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    try {

      const { id, name, emails } = profile;
      const user = {
        provider: "google",
        providerId: id,
        email: emails && emails.length > 0 ? emails[0].value : '',
        firstName: name!.givenName,
        lastName: name!.familyName,
        accessToken,
        refreshToken,
      };
      console.log(user);
      done(null, user);
    } catch(error) {
      done(error);
    }
  }
}
