import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/auth.decorator';
import { User } from 'src/users/decorators/user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@User() user: any) {
    return this.authService.login(user);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request) {
    return req.user;
  }
}
