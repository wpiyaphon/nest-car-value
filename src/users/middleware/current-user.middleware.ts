import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AppRequest } from '../../types/express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: AppRequest, _res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user || undefined;
    }

    next();
  }
}
