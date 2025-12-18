import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create default admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@blockchainmint.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TXCPaymentGateway@@@123';

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'System Admin',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    console.log(`✅ Created admin: ${admin.email}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${existingAdmin.email}`);
  }

  console.log('🌱 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
