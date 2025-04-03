import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { packRules } from '@casl/ability/extra';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly abilityService: CaslAbilityService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ability = this.abilityService.createForUser(user);

    const token = this.jwtService.sign({
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user.id,
      permissions: packRules(ability.rules),
    });

    return { access_token: token };
  }
}
