import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { CasesModule } from './cases/cases.module';
import { SitesModule } from './sites/sites.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ClientPortalModule } from './client-portal/client-portal.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ServiceRequestsModule,
    CasesModule,
    SitesModule,
    ShiftsModule,
    ClientPortalModule,
  ],
})
export class AppModule {}
