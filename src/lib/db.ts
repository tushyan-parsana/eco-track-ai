/**
 * @module db
 * @description Initialises and exports a singleton Prisma client connected
 * to a local libSQL (SQLite-compatible) database via the Prisma libSQL adapter.
 *
 * In development the instance is cached on `globalThis` to survive
 * hot-module reloads without exhausting database connections.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/** libSQL adapter configured to use the local dev.db file. */
const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});

/**
 * Augmented global scope used to store the Prisma singleton
 * across hot-module reloads during development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Shared Prisma client instance.
 *
 * - In **development** logs queries, errors, and warnings.
 * - In **production** only logs errors to reduce noise.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
