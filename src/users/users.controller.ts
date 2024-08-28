import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('me')
  findMe() {
    const username = 'testuser';
    return this.usersService.findOneByUsername(username);
  }

  @Get(':username')
  findOneByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':username/follow')
  follow(@Param('username') _username: string) {
    const followerId = '1';
    const followingId = '2';
    return this.usersService.follow(followerId, followingId);
  }

  @Delete(':username/unfollow')
  unfollow(@Param('username') _username: string) {
    const followerId = '1';
    const followingId = '2';
    return this.usersService.unfollow(followerId, followingId);
  }
}
