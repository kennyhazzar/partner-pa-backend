import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@resources/auth/guards';
import { ProfileDto, UserRequestContext } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Получение данных о своем профиле',
    description: 'Метод в разработке. Возможно в дальнейшем его и не будет)',
  })
  @ApiResponse({
    description: 'Профиль пользователя',
    type: ProfileDto,
  })
  @Get()
  @UseGuards(AuthGuard)
  async get(@Req() req: UserRequestContext): Promise<ProfileDto> {
    return this.userService.findOneByEmail(req.user.email, {
      email: true,
      phone: true,
      itn: true,
      firstName: true,
      secondName: true,
      lastName: true,
    });
  }

  @ApiOperation({
    summary: 'Обновление данных своего профиля',
    description: 'Метод в разработке. Возможно в дальнейшем его и не будет)',
  })
  @ApiResponse({
    description: 'Профиль пользователя',
    type: ProfileDto,
  })
  @Put()
  @UseGuards(AuthGuard)
  async update(@Req() req: UserRequestContext, @Body() payload: ProfileDto) {
    return this.userService.updateProfile(req.user, payload);
  }

  @ApiOperation({
    summary: 'Удаление профиля',
    description: 'Метод в разработке. Возможно в дальнейшем его и не будет)',
  })
  @ApiResponse({
    description: 'Удалено успешно',
    status: HttpStatus.OK,
  })
  @Delete()
  @UseGuards(AuthGuard)
  async delete(@Req() req: UserRequestContext) {
    return this.userService.deleteByEmail(req.user.email);
  }
}
