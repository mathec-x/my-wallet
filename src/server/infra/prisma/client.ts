import { LoggerService } from '@/server/application/services/logger/logger.service';
import 'server-only';
import { styleText } from 'util';
import { PrismaClient } from './generated';

const logger = new LoggerService('PrismaClient');
const prismaClient = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    { level: 'info', emit: 'event' },
    { level: 'query', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' }
  ]
});

prismaClient.$on('query', event => {
  // "my-wallet"."Account"
  const methodMatch = event.query.match(/^\s*(SELECT|INSERT|UPDATE|DELETE)/i);
  const method = methodMatch?.[1]?.toUpperCase();
  let tableMatch;
  if (method === 'SELECT') {
    tableMatch = event.query.match(/FROM\s+(?:"[^"]*"\.)?["\[`]?([^"\]`\s,;()]+)["\]`]?/i);
  } else if (method === 'INSERT') {
    tableMatch = event.query.match(/INTO\s+(?:"[^"]*"\.)?["\[`]?([^"\]`\s,;()]+)["\]`]?/i);
  } else if (method === 'UPDATE') {
    tableMatch = event.query.match(/UPDATE\s+(?:"[^"]*"\.)?["\[`]?([^"\]`\s,;()]+)["\]`]?\s+SET/i);
  } else if (method === 'DELETE') {
    tableMatch = event.query.match(/DELETE\s+FROM\s+(?:"[^"]*"\.)?["\[`]?([^"\]`\s,;()]+)["\]`]?/i);
  } else {
    logger.debug(event.query);
    return;
  }

  const table = tableMatch?.[1] || '';
  logger.verbose(`${method} ${styleText('green', `[${table}]`)} => (${event.duration}ms)`);
});

prismaClient.$on('info', event => {
  logger.info(event.message);
});

prismaClient.$on('warn', event => {
  logger.warn(event.message);
});

prismaClient.$on('error', event => {
  logger.error(event.message.trim(), event);
});


export const prisma = prismaClient;