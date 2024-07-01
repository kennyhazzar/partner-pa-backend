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
import { fullFindOptionsUserSelect, UpdateProfileDto, UserRequestContext } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities';

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
    type: UpdateProfileDto,
  })
  @Get()
  @UseGuards(AuthGuard)
  async get(@Req() req: UserRequestContext): Promise<UpdateProfileDto> {
    return this.userService.findOne(
      { id: req.user.id },
      fullFindOptionsUserSelect,
      (user) => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        itn: user.itn,
        firstName: user.firstName,
        secondName: user.secondName,
        lastName: user.lastName,
      } as unknown as User)
    );
  }

  @ApiOperation({
    summary: 'Обновление данных своего профиля',
    description: 'Метод в разработке. Возможно в дальнейшем его и не будет)',
  })
  @ApiResponse({
    description: 'Профиль пользователя',
    type: UpdateProfileDto,
  })
  @Put()
  @UseGuards(AuthGuard)
  async update(@Req() req: UserRequestContext, @Body() payload: UpdateProfileDto) {
    return this.userService.updateProfile({ id: req.user.id }, payload);
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
    return this.userService.delete({ id: req.user.id });
  }
}
