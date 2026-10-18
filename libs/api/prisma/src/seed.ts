import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client';
import 'dotenv/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

async function main(): Promise<void> {
  console.log('Seeding database...');

  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering' },
  });
  const operations = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: { name: 'Operations' },
  });
  const sales = await prisma.department.upsert({
    where: { name: 'Sales' },
    update: {},
    create: { name: 'Sales' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@opshub.local' },
    update: {},
    create: {
      keycloakId: 'seed-admin-id',
      email: 'admin@opshub.local',
      name: 'Avery Admin',
      role: 'ADMIN',
      departmentId: engineering.id,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@opshub.local' },
    update: {},
    create: {
      keycloakId: 'seed-manager-id',
      email: 'manager@opshub.local',
      name: 'Morgan Manager',
      role: 'MANAGER',
      departmentId: operations.id,
      managerId: admin.id,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@opshub.local' },
    update: {},
    create: {
      keycloakId: 'seed-employee-id',
      email: 'employee@opshub.local',
      name: 'Ellis Employee',
      role: 'EMPLOYEE',
      departmentId: sales.id,
      managerId: manager.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up CI pipeline',
        description: 'Configure GitHub Actions for lint, test, and build.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeId: admin.id,
        createdById: manager.id,
        departmentId: engineering.id,
      },
      {
        title: 'Review Q3 resource requests',
        description: 'Approve or reject pending laptop and license requests.',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeId: manager.id,
        createdById: manager.id,
        departmentId: operations.id,
      },
      {
        title: 'Onboard new sales hire',
        description: 'Prepare accounts, equipment, and training schedule.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        assigneeId: employee.id,
        createdById: manager.id,
        departmentId: sales.id,
      },
    ],
  });

  const laptop = await prisma.resource.create({
    data: {
      name: 'Dell Latitude 5440',
      category: 'Laptops',
      quantityTotal: 25,
      quantityAvailable: 18,
    },
  });

  await prisma.resourceRequest.create({
    data: {
      resourceId: laptop.id,
      requesterId: employee.id,
      approverId: manager.id,
      quantity: 1,
      status: 'PENDING',
      reason: 'Replacing a laptop with a failing battery.',
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Welcome to OpsHub',
      body: 'This is the first announcement on the platform.',
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
