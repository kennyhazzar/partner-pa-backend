import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LicensedObjectService } from './licensed-object.service';
import { CreateLicensedObjectDto } from './dto/create-licensed-object.dto';
import { UpdateLicensedObjectDto } from './dto/update-licensed-object.dto';

@Controller('licensed-object')
export class LicensedObjectController {
  constructor(private readonly licensedObjectService: LicensedObjectService) {}

  @Post()
  create(@Body() createLicensedObjectDto: CreateLicensedObjectDto) {
    return this.licensedObjectService.create(createLicensedObjectDto);
  }

  @Get()
  findAll() {
    return this.licensedObjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensedObjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicensedObjectDto: UpdateLicensedObjectDto) {
    return this.licensedObjectService.update(+id, updateLicensedObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licensedObjectService.remove(+id);
  }
}
