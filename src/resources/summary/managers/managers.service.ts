import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager, Partner } from '../entities';
import { DeepPartial, Repository } from 'typeorm';
import { UserService } from '@resources/user/user.service';
import { getRandomCode } from '@core/utils';
import { ALPHABET } from '@core/constants';
import { ManagerDto } from '../dto/manager.dto';
import { AuthService } from '@resources/auth/auth.service';
import { EntityService } from '@core/services';

@Injectable()
export class ManagersService {
  constructor(
    private readonly entityService: EntityService,
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    @InjectRepository(Manager)
    private readonly managersRepository: Repository<Manager>,
  ) {}

  async create(payload: ManagerDto) {
    const password = getRandomCode(8, ALPHABET);
    const newUser = await this.usersService.create(
      payload.email,
      password,
      payload.firstName,
    );
    const entity: DeepPartial<Manager> = {
      ...payload,
      userAccount: newUser,
    };

    if (payload.partnerId) {
      entity.partner = { id: payload.partnerId } as Partner;
    }

    const newManager = this.managersRepository.create(entity);

    const manager = await this.managersRepository.save(newManager);

    await Promise.allSettled([
      this.authService.sendVerificationCode(newUser.email),
      this.usersService.updateProfile(newUser, { managerId: manager.id }),
    ]);

    return { ...this.managersRepository.save(newManager), password };
  }
  async update(id: string, payload: ManagerDto) {
    return this.managersRepository.update(id, payload);
  }

  async find(take: number, skip: number) {
    return this.managersRepository.find({
      relations: {
        accounts: true,
        bills: true,
        licensedObjects: true,
        requisites: {
          requisites: true,
        },
        partner: true,
      },
      take,
      skip,
    });
  }

  async findOne(id: string) {
    return this.entityService.findOne({
      repository: this.managersRepository,
      cacheValue: id,
      relations: {
        accounts: true,
        bills: true,
        licensedObjects: true,
        requisites: {
          requisites: true,
        },
        partner: true,
      },
    });
  }
  async delete(id: string) {
    return this.managersRepository.delete(id);
  }
}
