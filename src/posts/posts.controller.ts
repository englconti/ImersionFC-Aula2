import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { RequiredRoles } from 'src/auth/required-roles.decorator';
import { Roles } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
@UseGuards(AuthGuard, RoleGuard) // the order of the guards is important, the first guard will be executed first
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    // console.log(req.user)
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user!.id, // !. is used to tell typescript that the user is not null -> its called non-null assertion
    });
  }

  @Get()
  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  findAll() {
    return this.postsService.findAll();
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @RequiredRoles(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
