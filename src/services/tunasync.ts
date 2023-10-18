import { getConfigs } from "../config";
import { Logger, executeCommand, executeCommandWithNoOutput } from "./common";

export type Worker = {
  "id": string,
  "url": string,
  "token": string,
  "last_online": string,
  "last_register": string
}

export type Mirror = {
  "name": string,
  "is_master": boolean,
  "status": string,
  "last_update": string,
  "last_update_ts": number,
  "last_started": string,
  "last_started_ts": number,
  "last_ended": string,
  "last_ended_ts": number,
  "next_schedule": string,
  "next_schedule_ts": number,
  "upstream": string,
  "size": string
}

export const getWorkers = (logger?: Logger) =>
  executeCommand<Worker[]>(['tunasynctl', 'workers', '-p', getConfigs().managerPort.toString()], logger);

export const getMirrors = (worker: string, logger?: Logger) =>
  executeCommand<Mirror[]>([`tunasynctl`, 'list', '-p', getConfigs().managerPort.toString(), worker], logger);

export const startJob = (worker: string, mirror: string, logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'start', '-p', getConfigs().managerPort.toString(), '-w', worker, mirror], logger);

export const stopJob = (worker: string, mirror: string, logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'stop', '-p', getConfigs().managerPort.toString(), '-w', worker, mirror], logger);

export const restartJob = (worker: string, mirror: string, logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'restart', '-p', getConfigs().managerPort.toString(), '-w', worker, mirror], logger);

export const disableJob = (worker: string, mirror: string, logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'disable', '-p', getConfigs().managerPort.toString(), '-w', worker, mirror], logger);

export const reloadWorker = (worker: string, logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'reload', '-p', getConfigs().managerPort.toString(), '-w', worker], logger);

export const flushAllJob = (logger?: Logger) =>
  executeCommandWithNoOutput([`tunasynctl`, 'flush', '-p', getConfigs().managerPort.toString()], logger);

