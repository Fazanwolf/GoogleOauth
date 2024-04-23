import {
  ConsoleLogger,
  Controller,
  Get,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuth2Guard } from "./guard/google.guard";
import { AuthService } from "./auth.service";
import { CoreConfigService } from "../core/modules/config/config.service";
import { ApiTags } from '@nestjs/swagger';

@Controller('oauth2')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: CoreConfigService) {}
  private readonly logger = new ConsoleLogger(AuthController.name);

  @ApiTags("OAuth2")
  @UseGuards(GoogleOAuth2Guard)
  @Get('passport')
  async loginFromPassport(@Request() req: Request) {
    this.logger.log('login with google');
  }

  @ApiTags("OAuth2")
  @Get('api')
  async loginFromApi(@Res() res: Response) {
    res.redirect(this.authService.generateAuthUrlFromApi());
  }

  // @Get('oauth2/axios')
  // async loginFromRequest(@Res() res: Response) {
  //   res.redirect(this.authService.generateAuthUrl());
  // }

  @ApiTags("Callback")
  @UseGuards(GoogleOAuth2Guard)
  @Get('callback/passport')
  async callbackPassport(@Request() req: Request, @Res() res: Response) {
    return this.authService.googleInfo(req);
  }

  @ApiTags("Callback")
  @Get('callback/api')
  async callbackApi(@Query() query: Record<string, any>, @Res() res: Response) {
    const tokens = await this.authService.handleApi(query);
    res.redirect(`/oauth2/user/info?access_token=${tokens.access_token}`)
  }

  // @Get('callback/axios')
  // async callbackAxios(@Request() req: Request, @Res() res: Response) {
  //   return this.authService.googleInfo(req);
  // }


  @ApiTags("User")
  @Get('user/info')
  async userInfo(@Query('access_token') access_token: string) {
    console.log(access_token);
    return await this.authService.getUserInfo(access_token);
  }
  
}
