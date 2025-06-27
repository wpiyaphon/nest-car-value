import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('can create a new user with salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throws error if user signs up with email that is in use', async () => {
    await service.signup('test@gmail.com', 'password');

    await expect(service.signup('test@gmail.com', 'test')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throws error if sign in is called with an unused email', async () => {
    await expect(service.signin('test@gmail.com', 'test')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throws error if an invalid password is provided', async () => {
    await service.signup('a', 'password');

    await expect(service.signin('a', 'password123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return a user if correct password is provided', async () => {
    await service.signup('a', 'password');

    const user = await service.signin('a', 'password');
    expect(user).toBeDefined();
  });
});
