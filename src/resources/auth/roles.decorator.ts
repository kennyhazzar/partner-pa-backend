import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@core/types';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
