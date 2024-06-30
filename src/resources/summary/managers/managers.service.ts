import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager, Partner } from '../entities';
import { FindOneOptions, Repository } from 'typeorm';
import { UserService } from '@resources/user/user.service';
import { getRandomCode } from '@core/utils';
import { ALPHABET } from '@core/constants';
import { ManagerDto } from '../dto/manager.dto';

@Injectable()
export class ManagersService {
  constructor(
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
    const entity: Omit<Manager, 'id' | 'createdAt' | 'updatedAt'> = {
      ...payload,
      userAccount: newUser,
    };

    if (payload.partnerId) {
      entity.partner = { id: payload.partnerId } as Partner;
    }

    const newManager = this.managersRepository.create({
      ...payload,
      partner: {
        id: payload.partnerId,
      },
    });

    return this.managersRepository.save(newManager);
  }
  async update(id: string, payload: ManagerDto) {
    return this.managersRepository.update(id, payload);
  }
  async findOne(options: FindOneOptions<Manager>) {
    return this.managersRepository.findOne(options);
  }
  async delete(id: string) {
    return this.managersRepository.delete(id);
  }

  async addObject() {}
}
