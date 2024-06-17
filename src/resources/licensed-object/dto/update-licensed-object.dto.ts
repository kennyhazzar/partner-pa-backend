import { PartialType } from '@nestjs/mapped-types';
import { CreateLicensedObjectDto } from './create-licensed-object.dto';

export class UpdateLicensedObjectDto extends PartialType(CreateLicensedObjectDto) {}
