import 'dotenv/config';
import path from 'node:path';
import type { PrismaConfig } from 'prisma';

export default {
  schema: path.join('src/server/infra/prisma', 'schema.prisma'),
  // migrations: {
  //   path: path.join("db", "migrations"),
  // },
  // views: {
  //   path: path.join("db", "views"),
  // },
  // typedSql: {
  //   path: path.join("db", "queries"),
  // }
} satisfies PrismaConfig;