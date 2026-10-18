import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'libs/api/prisma/src/schema.prisma',
  migrations: {
    path: 'libs/api/prisma/src/migrations',
    seed: 'tsx libs/api/prisma/src/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
