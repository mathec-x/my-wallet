import 'server-only';
import { PrismaClient } from './generated';

// prevent multiple instances caused by next hot reload
// export class PrismaService {
//   private static instance: PrismaClient;

//   private constructor() {

//   }

//   public static getInstance(): PrismaClient {
//     if (!PrismaService.instance) {
//       console.log(styleText('greenBright', 'prisma:instance New instance of PrismaClient'));
//       PrismaService.instance = new PrismaClient({
//         log: ['info', 'warn'],
//       });
//     }

//     if (process.env.NODE_ENV === 'development') {
//       setTimeout(() => {
//         console.log(styleText('redBright', 'prisma:instance Disconecting PrismaClientDev'));
//         this.disconnect();
//       }, 5000);
//     }

//     return PrismaService.instance;
//   }

//   public static async disconnect() {
//     if (PrismaService.instance) {
//       await PrismaService.instance.$disconnect();
//       PrismaService.instance = undefined!;
//     }
//   }
// }

// export const prisma = PrismaService.getInstance();
export const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
  errorFormat: 'pretty'
});