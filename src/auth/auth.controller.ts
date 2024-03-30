import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { Auth } from './decorators/role-protected/auth.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Response, Request } from 'express';

@Controller('auth')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.authService.create(createUserDto, res);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }

  @Get('logout')
  @Auth(ValidRoles.user)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('refresh')
  checkAuthStatus(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }

  @Get('verify')
  verify(@Req() req: Request) {
    return this.authService.verify(req);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':term')
  @Auth(ValidRoles.user)
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.user)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
