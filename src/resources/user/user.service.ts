import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from './entities';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRandomCode } from '@core/utils';
import { ALPHABET } from '@core/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    const cacheKey = `user_${email}`;

    let user = await this.cacheManager.get<User>(cacheKey);

    if (!user) {
      user = await this.userRepository.findOne({ where: { email } });

      if (user) {
        await this.cacheManager.set(cacheKey, user);
      }
    }

    return user;
  }

  async create(email: string): Promise<User> {
    const newUser = this.userRepository.create({ email });

    this.cacheManager.set(`user_${email}`, newUser);

    return this.userRepository.save(newUser);
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token: getRandomCode(120, ALPHABET),
      user,
      expiresAt: expirationTime,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async getRefreshToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
