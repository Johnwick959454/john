import { Module } from '@nestjs/common';
import { ClientPortalController } from './client-portal.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClientPortalController],
})
export class ClientPortalModule {}
