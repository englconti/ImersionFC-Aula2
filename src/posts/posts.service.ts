import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  create(createPostDto: CreatePostDto & { authorId: string }) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'Post')) {
      throw new Error('You are not allowed to create a post');
    }

    return this.prismaService.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'Post')) {
      throw new Error('You are not allowed to read posts');
    }

    return this.prismaService.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  async findOne(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'Post')) {
      throw new Error('You are not allowed to read posts');
    }

    const post = await this.prismaService.post.findUnique({
      where: { id, AND: [accessibleBy(ability, 'read').Post] },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('delete', 'Post')) {
      throw new Error('You are not allowed to delete posts');
    }

    const post = await this.prismaService.post.findUnique({
      where: { id, AND: [accessibleBy(ability, 'delete').Post] },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
