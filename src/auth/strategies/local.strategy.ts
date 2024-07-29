import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // In this example, the passport-local strategy by default expects
    // properties called username and password in the request body.
    // Pass an options object to specify different property names,
    // for example: super({ usernameField: 'email' })
    super();
  }

  // For the local-strategy, Passport expects a validate() method with
  // the following signature: validate(username: string, password:string): any
  // The validate method in LocalStrategy is where the actual validation of user credentials happens, whereas
  // in our JWT Strategy, we called the validate method after the token's validity has been confirmed.

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }

    //  Passport automatically creates a user object, based on the value we return from the validate() method, and assigns it to the Request object as req.user
    return {
      id: user.id,
      username: user.username,
      accountStatus: user.accountStatus,
    };
  }
}
