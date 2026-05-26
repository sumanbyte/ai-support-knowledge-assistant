import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../../../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    const adapter = new PrismaNeon({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
