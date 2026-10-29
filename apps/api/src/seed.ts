import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial system super-admin account...');
  const adminEmail = 'admin@covenantshield.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        fullName: 'Covenant Shield Admin',
        role: Role.SUPER_ADMIN,
        phone: '+251911000000',
        organizationName: 'Covenant Shield HQ',
      },
    });
    console.log(`Super Admin created successfully: ${admin.email}`);
  } else {
    console.log(`Super Admin ${adminEmail} already exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
