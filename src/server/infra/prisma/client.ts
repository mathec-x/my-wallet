import { PrismaClient } from './generated';

export class PrismaService {
  private static instance: PrismaClient;

  private constructor() { }

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }

    return PrismaService.instance;
  }

  public static async disconnect() {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
      PrismaService.instance = undefined!;
    }
  }
}

// prevent multiple instances caused by next hot reload
export const prisma = PrismaService.getInstance();