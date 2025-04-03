import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

@Injectable() // injectable decorator is used to make the class injectable which means it can be injected into other classes
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // why Promise<boolean>? because we are using async and await
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<{
        name: string;
        email: string;
        role: Roles;
        sub: string;
      }>(token, {
        algorithms: ['HS256'],
      });

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        // if the user is not found, throw an unauthorized exception
        throw new UnauthorizedException('User not found');
      }

      request.user = user; // if the user is found, add the user to the request
      this.abilityService.createForUser(user); // create the ability for the user

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', { cause: error });
    }
  }
}
