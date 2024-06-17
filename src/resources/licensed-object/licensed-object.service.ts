import { Injectable } from '@nestjs/common';
import { CreateLicensedObjectDto } from './dto/create-licensed-object.dto';
import { UpdateLicensedObjectDto } from './dto/update-licensed-object.dto';

@Injectable()
export class LicensedObjectService {
  create(createLicensedObjectDto: CreateLicensedObjectDto) {
    return 'This action adds a new licensedObject';
  }

  findAll() {
    return `This action returns all licensedObject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} licensedObject`;
  }

  update(id: number, updateLicensedObjectDto: UpdateLicensedObjectDto) {
    return `This action updates a #${id} licensedObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} licensedObject`;
  }
}
