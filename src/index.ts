import core from './core';

import chalk from 'chalk';
import KoaServerPlugin from 'eureka-koa-server-plugin';
import KoaStackDriverLoggerPlugin from 'eureka-stackdriver-logger-plugin';

const Logger = core.logger();
const prefix = '[base-api]';

core.boot(async (): Promise<void> => {

  // ADD BUILD INFORMATION TO HEALTH ENDPOINT
  KoaServerPlugin.appendToHealth('info', () => KoaStackDriverLoggerPlugin.getConfiguration());
  KoaServerPlugin.addRoutesFromFolder(`${__dirname}/api`, true, {
    type: 'jwt',
    options: {
      publicKeyPath: `${process.cwd()}/config/key.pub`
    }
  });
  

  Logger.info(`${prefix} ${chalk.bold.green('ready and listenning')} for messages`);

});

