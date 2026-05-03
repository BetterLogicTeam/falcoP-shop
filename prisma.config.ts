import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node --compiler-options "{\\"module\\":\\"CommonJS\\"}" prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Used by CLI (`db push`, migrate) for DDL — must not be only the :6543 pooler URL.
    directUrl: env("DIRECT_URL"),
  },
});
