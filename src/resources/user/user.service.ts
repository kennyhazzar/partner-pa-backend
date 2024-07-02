import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from './entities';
import {
  DeepPartial,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRandomCode } from '@core/utils';
import { ALPHABET } from '@core/constants';
import {
  fullFindOptionsUserSelect,
  ProfileDto,
  UpdateProfileDto,
  UserFindOneWhere,
} from './dto';
import * as bcrypt from 'bcrypt';
import { EntityService } from '@core/services';
import { UserRole } from '@core/types';
import { SetRoleDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(
    private readonly entityService: EntityService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(
    where: FindOptionsWhere<{ id?: string; email?: string }>,
    select?: FindOptionsSelect<User>,
    transform?: (entity: User) => User,
  ): Promise<User | undefined> {
    return this.entityService.findOne<User>({
      repository: this.userRepository,
      select,
      cacheValue: where?.id as string,
      relations: {
        managerAccount: {
          accounts: true,
          licensedObjects: { partner: true, requisites: true },
        },
      },
      where: {
        ...where,
        isDeleted: false,
      },
      transform,
    });
  }

  async create(
    email: string,
    password: string,
    firstName: string,
  ): Promise<User> {
    const isUserExist = await this.findOne({ email });

    if (isUserExist) {
      throw new BadRequestException(
        'Пользователь с такой почтой уже зарегистрирован',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
    });

    this.cacheManager.set(`user_${newUser.id}`, newUser);

    return this.userRepository.save(newUser);
  }

  async confirmEmail(email: string): Promise<void> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const newUser = await this.userRepository.save({
      ...user,
      isEmailConfirmed: true,
    });

    this.cacheManager.set(`user_${newUser.id}`, newUser);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const newUser = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    this.cacheManager.set(`user_${newUser.id}`, newUser);
  }

  async delete(where: UserFindOneWhere): Promise<void> {
    const user = await this.findOne({ ...where });

    if (!user) {
      throw new BadRequestException('Пользователь не существует');
    }

    await this.userRepository.save({
      ...user,
      isDeleted: true,
      deletedAt: new Date(),
    });

    this.cacheManager.del(`user_${user.id}`);
  }

  async updateProfile(
    where: UserFindOneWhere,
    payload: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const user = await this.findOne(where, fullFindOptionsUserSelect);

    const update: DeepPartial<User> = {
      ...user,
      ...payload,
    };

    if (payload?.managerId) {
      update.managerAccount = { id: payload.managerId };

      delete update['managerId'];
    }

    try {
      await this.userRepository.update(user.id, update);
    } catch (error) {
      throw new BadRequestException('Что-то пошло не так при обновлении');
    }

    const updateUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    this.cacheManager.set(`user_${user.id}`, updateUser);

    return {
      id: updateUser.id,
      email: updateUser.email,
      phone: updateUser.phone,
      itn: updateUser.itn,
      firstName: updateUser.firstName,
      secondName: updateUser.secondName,
      lastName: updateUser.lastName,
    };
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
    return this.entityService.findOne<RefreshToken>({
      repository: this.refreshTokenRepository,
      select: { id: true, expiresAt: true, user: fullFindOptionsUserSelect },
      cacheValue: token,
      relations: { user: true },
      where: { token },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async setRole(payload: SetRoleDto): Promise<void> {
    if (!payload?.id && !payload?.email) {
      throw new BadRequestException()
    }

    const where: DeepPartial<{ id: string; email: string }> = {};
    
    if (payload?.id) {
      where.id = payload.id;
    }

    if (payload?.email) {
      where.email = payload.email;
    }
    
    await this.userRepository.update({ ...where }, { role: payload.role });
    await this.entityService.findOne<User>({
      bypassCache: true,
      repository: this.userRepository,
      cacheValue: where?.id as string,
      relations: {
        managerAccount: {
          accounts: true,
          licensedObjects: { partner: true, requisites: true },
        },
      },
      where: {
        ...where,
        isDeleted: false,
      },
    });
  }
}
