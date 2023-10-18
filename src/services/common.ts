import { spawn } from 'child_process'

export type Logger = (message: string) => void;

export function executeCommand<T>(cmd: string[], logger?: Logger) {
  return new Promise<T>((resolve, reject) => {
    logger?.('$ ' + cmd.join(' '));
    const process = spawn(cmd[0], cmd.slice(1));

    let output = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      logger?.("[ERR] " + data.toString());
    });

    process.on('close', (code) => {
      if (code === 0) resolve(JSON.parse(output));
      else {
        logger?.(`[EXIT] ${code}`);
        reject(code);
      }
    });

    process.on('error', (error) => {
      logger?.(error.toString());
      reject(error);
    });
  });
}

export const executeCommandWithNoOutput = (cmd: string[], logger?: Logger, options?: any) => new Promise<void>((resolve, reject) => {
  logger?.('$ ' + cmd.join(' '));
  const process = spawn(cmd[0], cmd.slice(1), options);

  process.stdout.on('data', (data) => {
    logger?.(data.toString());
  });

  process.stderr.on('data', (data) => {
    logger?.("[ERR] " + data.toString());
  });

  process.on('close', (code) => {
    if (code === 0) resolve();
    else {
      logger?.(`[EXIT] ${code}`);
      reject(code);
    }
  });

  process.on('error', (error) => {
    logger?.(error.toString());
    reject(error);
  });
});

