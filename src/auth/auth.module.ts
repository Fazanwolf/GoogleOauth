
import { Module } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from "./strategy/google.strategy";
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    HttpModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
