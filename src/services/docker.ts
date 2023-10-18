import { getConfigs } from "../config";
import { Logger, executeCommandWithNoOutput } from "./common";

export const cicdUpdate = (content: string, branch: string, logger: Logger) =>
  executeCommandWithNoOutput(['docker', 'compose', 'exec', '-it',
    'cicd', '/update.sh', content, branch], logger, {
    cwd: getConfigs().composeDir
  });


export const startAll = (logger: Logger) =>
  executeCommandWithNoOutput(['docker', 'compose', 'up', '-d'], logger, {
    cwd: getConfigs().composeDir
  });

export const stopAll = (logger: Logger) =>
  executeCommandWithNoOutput(['docker', 'compose', 'down'], logger, {
    cwd: getConfigs().composeDir
  });


export const composePS = (logger: Logger) =>
  executeCommandWithNoOutput(['docker', 'compose', 'ps'], logger, {
    cwd: getConfigs().composeDir
  });


