import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppRequest } from '../types/express';

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AppRequest = context.switchToHttp().getRequest();

    return request?.session?.userId;
  }
}
