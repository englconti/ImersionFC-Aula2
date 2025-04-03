import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs'; // Observable is a class that is used to handle asynchronous events
import { Reflector } from '@nestjs/core'; // Reflector is a class that is used to get metadata from decorators
import { Roles } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  // implements CanActivate is a class that is used to implement the CanActivate interface
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Roles[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authUser = request.user;

    return (
      authUser!.role === Roles.ADMIN || requiredRoles.includes(authUser!.role)
    );
  }
}
