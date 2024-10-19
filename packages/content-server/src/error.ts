import { printError, printInfo, printWarning } from './utilities/log';

/* ------------------------------------- Promise Rejections ------------------------------------- */

// Log unhandled promise rejections
const unhandledPromises: {
  promise: Promise<any>;
  reason: Parameters<NodeJS.UnhandledRejectionListener>[0];
}[] = [];

process.once('unhandledRejection', (reason, promise) => {
  unhandledPromises.push({ promise, reason });

  if (!reason) {
    // eslint-disable-next-line no-console
    console.trace('Unknown promise rejection');
    return;
  }

  const stackString = (reason as Error).stack ? `: ${(reason as Error).stack}` : '';
  printWarning(`Possibly unhandled promise rejection${stackString}`);
});

// Log all unhandled rejections before exiting
process.on('exit', () => {
  if (unhandledPromises.length > 0) {
    printWarning('Unhandled rejections before exiting:');

    unhandledPromises.forEach((promise) => {
      const reason = promise.reason as any;

      if (typeof reason.toString === 'function') {
        printWarning(reason);
      }
    });
  }
});

// Handled promise rejection logging is temporarily removed because of an error

// // Log handled promise rejections
// global.Promise = new Proxy(global.Promise, {
//   get(target, propertyName, receiver) {
//     const targetValue = Reflect.get(target, propertyName, receiver);

//     if (typeof targetValue === 'function' && propertyName === 'reject') {
//       return (...args: any[]) => {
//         printWarning('Handled promise rejection:', args[0].message);

//         return targetValue.apply(this, args);
//       };
//     }

//     return targetValue;
//   },
// });

/* ------------------------------------------- Errors ------------------------------------------- */

process.on('uncaughtException', (error) => {
  if (!error) {
    // eslint-disable-next-line no-console
    console.trace('Unknown error');
    return;
  }

  printError('Uncaught error:', error.message);
  printError(error.stack);
});

// Log all errors (only in verbose mode)
global.Error = new Proxy(global.Error, {
  construct(Target, args) {
    if (
      args[0] &&
      !(args[0].includes('ENOENT: no such file or directory') && args[0].includes('node_modules'))
    ) {
      printInfo('Caught Error:', args[0]);
    }

    return new Target(...args);
  },
});
