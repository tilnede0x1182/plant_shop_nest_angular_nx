import 'dotenv/config';

import { defineConfig } from 'prisma/config';
import path from 'node:path';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
});
