import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from './entities';
import { FindOneOptions, FindOptionsSelect, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRandomCode } from '@core/utils';
import { ALPHABET } from '@core/constants';
import { ProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOneByEmail(email: string, select?: FindOptionsSelect<User>): Promise<User | undefined> {
    const cacheKey = `user_${email}`;

    let user = await this.cacheManager.get<User>(cacheKey);

    if (!user) {
      const options: FindOneOptions<User> = {
        where: { email, isDeleted: false },
      };
  
      if (select) {
        options.select = select;
      }

      user = await this.userRepository.findOne(options);

      if (user) {
        await this.cacheManager.set(cacheKey, user);
      }
    }

    return user;
  }

  async create(email: string): Promise<User> {
    const isUserExist = await this.findOneByEmail(email);

    if (isUserExist) {
      throw new BadRequestException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }

    const newUser = this.userRepository.create({ email });

    this.cacheManager.set(`user_${email}`, newUser);

    return this.userRepository.save(newUser);
  }

  async deleteByEmail(email: string): Promise<void> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Пользователь не существует');
    }

    await this.userRepository.save({
      ...user,
      isDeleted: true,
      deletedAt: new Date(),
    });

    this.cacheManager.del(`user_${email}`);
  }

  async updateProfile(user: User, payload: ProfileDto): Promise<ProfileDto> {
    await this.userRepository.update(user.id, payload);
    
    const updateUser = await this.userRepository.findOne({ where: { id: user.id } });
    this.cacheManager.set(`user_${user.email}`, updateUser);

    return {
      email: updateUser.email,
      phone: updateUser.phone,
      itn: updateUser.itn,
      firstName: updateUser.firstName,
      secondName: updateUser.secondName,
      lastName: updateUser.lastName,
    }
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
