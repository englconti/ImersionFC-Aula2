import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  create(createUserDto: CreateUserDto, req: Request) {
    if (!req.user) {
      throw new Error('User not found in request');
    }

    let ability = this.abilityService.ability;
    if (!ability) {
      console.log('creating ability for user', req.user);
      ability = this.abilityService.createForUser(req.user);
    }

    if (!ability.can('create', 'User')) {
      throw new Error('User does not have permission to create users');
    }

    if (
      !createUserDto.name ||
      !createUserDto.email ||
      !createUserDto.password
    ) {
      throw new Error(
        'Missing required fields: name, email, and password are required',
      );
    }

    // Log the data being sent to Prisma
    console.log('Creating user with data:', {
      ...createUserDto,
    });

    try {
      return this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: bcrypt.hashSync(createUserDto.password, 10),
          role: createUserDto.role || 'READER',
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
