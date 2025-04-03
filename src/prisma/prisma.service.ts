import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  // aqui implementamos o OnModuleInit para que o prisma se conecte ao banco de dados quando o módulo for inicializado
  async onModuleInit() {
    await this.$connect();
  }
}
