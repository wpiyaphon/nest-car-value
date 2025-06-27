import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../../types/express';

export const CurrentUser = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    const user = request.currentUser;
    return user;
  },
);
