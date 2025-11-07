/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect, styleText } from 'node:util';

export class LoggerService {
  constructor(private readonly name: string) { }
  private getPrefix(lv: string) {
    const prefix = styleText('grey', `[${process.env.NODE_ENV}] ${new Date().toLocaleString()}`);
    const info = styleText('yellowBright', `[${this.name}]`);
    const level = styleText('whiteBright', lv.padStart(7, ' '));
    return `${prefix} - ${level} ${info}`;
  }

  verbose(message: string) {
    console.log(`${this.getPrefix('VERBOSE')} ${styleText('grey', message)}`);
  }

  debug(message: string, ...data: any[]) {
    console.log(`${this.getPrefix('DEBUG')} ${styleText('magentaBright', message)}`);
    for (const log of data) {
      console.log('', styleText('grey', typeof log), inspect(log, { depth: 5, colors: true }));
    }
  }

  info(message: string, ...data: any[]) {
    console.log(`${this.getPrefix('INFO')} ${styleText('cyanBright', message)}`);
  }

  warn(message: string, ...data: any[]) {
    console.log(`${this.getPrefix('WARN')} ${styleText('yellowBright', message)}`);
  }

  error(message: string, error: unknown) {
    console.log(`${this.getPrefix('ERROR')} ${styleText('redBright', message)}`, (error as Error)?.message || error);
  }

  alert(message: string, ...data: any[]) {
    console.log(`${this.getPrefix('ALERT')} ${styleText('cyanBright', message)}`);
  }
}