import { render } from 'react-blessed';
import blessed from 'blessed';

import App from './app';
import React from 'react';

import fs from 'fs';
import path from 'path';
import { setConfigs } from './config';

const configPath = path.join(process.env['HOME']!, '.config/hm-admin.json');

if (!fs.existsSync(configPath)) {
  console.log('config.json not found');
  process.exit(1);
}

// read config
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
if (config) {
  setConfigs(config);
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'hustmirror-admin-tui',
  debug: true
});

process.on('unhandledRejection', (reason) => {
  screen.debug('Unhandled Rejection at promise, reason: ' + reason);
});
process.on('uncaughtException', (reason) => {
  screen.debug('Unhandled exception, reason: ' + reason);
})

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
// screen.key(['tab'], () => screen.focusNext());
// screen.key(['S-tab'], () => screen.focusPrevious());

global.screen = screen;

render(React.createElement(App), screen);
