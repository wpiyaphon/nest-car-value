import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use.');
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the password and the salt together
    const hash = scryptSync(password, salt, 32);

    // Joined the hash result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found.');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = scryptSync(password, salt, 32).toString('hex');

    if (hash !== storedHash) {
      throw new BadRequestException('wrong password.');
    }

    return user;
  }
}
