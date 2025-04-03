import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'; // those are decorators that are used to decorate the controller and the routes. Decorators are used to add metadata to the controller and the routes.
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { RequiredRoles } from 'src/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { RoleGuard } from 'src/auth/role/role.guard';

@UseGuards(AuthGuard, RoleGuard) // this is a guard that will be used to protect the routes that are not public so that only authenticated users can access them. If we want specific routes to be public, we can use the @Public decorator. If we want to use guards in specific routes, we can use the @UseGuards decorator on the specific route.
@RequiredRoles(Roles.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.usersService.create(createUserDto, req);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
