import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { clearScreenDown } from 'readline';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    // console.log(req.user)
    console.log('---->', req.user)
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user!.id // !. is used to tell typescript that the user is not null -> its called non-null assertion
    });
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.postsService.findAll(req.user!.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
