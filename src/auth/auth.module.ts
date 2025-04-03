import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true, // global module is used to make the module available globally  so it can be used in any controller
      secret: 'secret', // secret key to encode and decode the token
      signOptions: { expiresIn: '2h', algorithm: 'HS256' }, // options for the token. expiresIn is the time the token will be valid. algorithm is the algorithm to encode and decode the token. HS256 is the algorithm to encode and decode the token.
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
