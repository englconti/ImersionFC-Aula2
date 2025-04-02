import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // para que o prisma seja usado em todos os módulos sem necessidade de importar o módulo em cada um
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
