export type Configurations = {
  managerPort: number;
  composeDir: string;
  logFile: string;
}


let configs: Configurations;

export const setConfigs = (config: Configurations) => {
  configs = config;
}

export const getConfigs = () => configs;
