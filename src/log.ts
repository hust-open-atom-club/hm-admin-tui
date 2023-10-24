import fs from 'fs/promises';
import process from 'process';
import { getConfigs } from './config';

export async function writeLog(...args: any[]) {
  try {
    const f = await fs.open(getConfigs().logFile, 'a')
    await f.write(`[${new Date().toISOString()}] ${args.join(' ')}\n`);
    await f.close();
  } catch (e) {
    console.error("Fail to log, operation is not permitted! ", e);
    process.exit(1);
  }
}
