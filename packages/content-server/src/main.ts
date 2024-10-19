import chalk from 'chalk';

import * as profiler from '@google-cloud/profiler';

import dotenv from 'dotenv';
import { isProduction, isProductionTest } from './utilities/environment';
import { getSecret, initializeSecrets } from './utilities/gapis';
import { print, printWarning, setLogLevel } from './utilities/log';
import createWebserver from './webserver';

/* -------------------------------------- Global Constants -------------------------------------- */

const port = process.env.PORT || 8080;

/* ------------------------------------------ Startup ------------------------------------------- */

(async () => {
  // this caches all the secrets from gcp when server is initiated from production

  if (!isProduction) {
    // load for local env because getting from google server takes time
    dotenv.config();
  }

  if (isProduction) {
    await initializeSecrets();
  }

  let logLevel = 0;
  let databaseAddress = 'mongodb://127.0.0.1:27017';

  if (isProduction) {
    if (!isProductionTest) {
      profiler.start({ serviceContext: { service: 'content-server' } });
    }

    databaseAddress = await getSecret('databaseURL');
  } else {
    logLevel = process.argv.includes('--verbose') ? 2 : 1;
  }

  setLogLevel(logLevel);

  // Start Webserver
  const server = await createWebserver(databaseAddress, logLevel);

  server.listen(port, async () => {
    const url = chalk.blue(`https://localhost:${port}/api\n`);
    print(`API is listening at ${url}`);

    if (isProduction) {
      const productionWarning =
        '\n\nWARNING: You are connected to a production database!' +
        ' If you did not want to do this, please stop this server immediately' +
        ' and start a development server with "yarn dev".\n';

      printWarning(chalk.bgRed(productionWarning));
    }
  });
})();
