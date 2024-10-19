/* eslint-disable no-console */

import { GraphQLRequestContextExecutionDidStart } from 'apollo-server-types';
import chalk, { Chalk } from 'chalk';
import { highlight } from 'cli-highlight';
import { Request, Response } from 'express';
import { ExecutionResult, GraphQLSchema, execute } from 'graphql';
import { TokenIndexer } from 'morgan';

/* ------------------------------------------ Globals ------------------------------------------- */

const LOCALE_OPTIONS = Object.freeze({ hour12: false });

const PREFIXES = Object.freeze({
  error: '❌',
  info: '✏️',
  log: '⚪',
  warn: '⚠️',
  request: '⚡',
});

const STATUS_COLORS: { [key: number]: Chalk } = Object.freeze({
  2: chalk.green,
  3: chalk.cyan,
});

let workerId: number;

let logLevel: number;

/* ------------------------------------------ Exports ------------------------------------------- */

export function setLogLevel(newLogLevel: number) {
  logLevel = newLogLevel;
}

export function printInfo(...args: any[]) {
  if (logLevel > 0) {
    outputToConsole('info', ...args);
  }
}

function printVerbose(...args: any[]) {
  if (logLevel > 1) {
    outputToConsole('info', ...args);
  }
}

export function print(...args: any[]) {
  outputToConsole('log', ...args);
}

export function printWarning(...args: any[]) {
  outputToConsole('warn', ...args);
}

export function printError(...args: any[]) {
  outputToConsole('error', ...args);
}

/* ------------------------------------- Locals and helpers ------------------------------------- */

export function morganGenerator(
  tokens: TokenIndexer<Request, Response>,
  ...requestResponse: [Request, Response]
) {
  const { method, url, status, res } = tokens;

  // Build and color each part of the logged message

  // Status
  const statusCode = status(...requestResponse) || '-';
  const statusChar = parseInt(statusCode[0], 10);
  const statusText = ` [${(STATUS_COLORS[statusChar] || chalk.red)(statusCode)}]`;

  const pathText = url(...requestResponse);
  const requestMethod = method(...requestResponse) || '';

  let operationDetails = '';
  if (requestMethod === 'POST') {
    operationDetails = requestResponse[0].body?.operationName;
  } else {
    const queryNameMatch = decodeURI(pathText || '').match(
      /query=(?:(?:query|subscription)[^{]+|){\s*(\w+)/s,
    );
    operationDetails = queryNameMatch?.[1] || '';
  }

  const pathName = pathText?.split('?')[0];
  const isImportantMethod = ['GET', 'POST'].includes(requestMethod);

  const message = [
    generatePrefix('request') + statusText,
    requestMethod,
    chalk[isImportantMethod ? 'yellow' : 'grey'](
      operationDetails ? `${pathName} (${operationDetails})` : pathText,
    ),
  ].join(' ');

  // Response time

  const responseTime = parseInt(
    tokens['response-time'](...requestResponse, 'content-length') || '',
    10,
  );
  const timeColor = responseTime < 1000 ? chalk.green : chalk.yellow;
  const timeText = timeColor(!Number.isNaN(responseTime) ? `${responseTime}ms` : 'unknown');

  // Response size
  const responseSize = parseInt(res(...requestResponse, 'content-length') || '', 10);

  let sizeText;
  if (responseSize) {
    const sizeColor = responseSize < 1024 ? chalk.green : chalk.yellow;
    sizeText = sizeColor(`${responseSize} bytes`);
  } else {
    sizeText = 'unknown';
  }

  // Append more request metadata to the message
  let metadata = `response: { time: ${timeText}, size: ${sizeText} }`;

  if (process.argv.includes('production') || logLevel > 1) {
    // Add more information if the verbosity is set
    metadata += [
      '',
      `referrer: ${chalk.blue(tokens.referrer(...requestResponse))}`,
      `address: ${chalk.blue(tokens['remote-addr'](...requestResponse))}`,
      `http: ${chalk.blue(tokens['http-version'](...requestResponse))}`,
      `user agent: ${chalk.blue(tokens['user-agent'](...requestResponse))}`,
    ].join(' | ');
  }

  const logText = `${message} | ${metadata}${logLevel > 1 ? '\n' : ''}`;

  return isImportantMethod ? logText : chalk.grey(logText);
}

export function graphQueryLogger(
  requestContext: GraphQLRequestContextExecutionDidStart<Record<string, any>>,
  originalExecutor: typeof execute,
  schema: GraphQLSchema,
) {
  return new Promise<ExecutionResult<Record<string, any>>>((resolve) => {
    const { context, document, request } = requestContext;

    const currentDefinition = requestContext.document.definitions.filter(
      (definition) => (definition as any).name?.value === request.operationName,
    )[0];

    if (currentDefinition?.loc && requestContext.source) {
      const queryString = requestContext.source.substring(
        currentDefinition.loc.start,
        currentDefinition.loc.end,
      );
      const queryGroups = concatenateLines(queryString).match(/(query|mutation) ([^\s(]+) (.*)/);

      if (queryGroups) {
        const queryTypeText = chalk.blue(queryGroups[1]);
        const operationNameText = chalk.yellow(queryGroups[2]);
        const requestBody = highlightJSON(queryGroups[3]);

        print(`GraphQL API request: ${queryTypeText} ${operationNameText} ${requestBody}`);
      }
    }

    const executionArgs = {
      schema,
      document,
      contextValue: context,
      variableValues: request.variables,
      operationName: request.operationName,
    };

    resolve(originalExecutor(executionArgs));
  });
}

export function graphResponseLogger(target: () => void, thisArg: any, argumentsList: any[]) {
  let responseData: Record<string, any> = {};

  try {
    if (argumentsList[0] || argumentsList[0].length > 0) {
      responseData = JSON.parse(argumentsList[0]);
    }
  } catch (exception) {
    [responseData.data] = argumentsList;
  }

  let graphQLResponse = '<emtpy>';

  // eslint-disable-next-line no-underscore-dangle
  if (!responseData.data || !responseData.data.__schema) {
    graphQLResponse = JSON.stringify(responseData, null, 2);

    if (graphQLResponse.length > 150 && graphQLResponse.length < 1024) {
      if (logLevel > 1) {
        printVerbose(`GraphQL response: ${highlightJSON(graphQLResponse)}`);
      } else {
        print('GraphQL response too long. Run in verbose mode to log the full response.');
      }
    } else if (graphQLResponse.length < 150 || logLevel > 1) {
      print(`GraphQL response: ${highlightJSON(concatenateLines(graphQLResponse))}`);
    }
  }

  Reflect.apply(target, thisArg, argumentsList);
}

function outputToConsole(methodName: keyof typeof PREFIXES, ...args: string[]) {
  let processedArguments = args;

  // Highligh specific parts of the logged message
  if (methodName === 'error') {
    // Make error messages red
    processedArguments = args.map((argument) => chalk.red(argument));
  }
  if (methodName !== 'request') {
    console[methodName](generatePrefix(methodName), ...processedArguments);
  }
}

function generatePrefix(methodName: keyof typeof PREFIXES) {
  // Build prefix from time, log type and worker ID (if exists)
  const timeStamp = chalk.cyan.bold(new Date().toLocaleString('en-US', LOCALE_OPTIONS));
  const workerPrefix = workerId ? ` [${workerId}]` : '';

  return `${timeStamp}${workerPrefix} ${PREFIXES[methodName]} `;
}

function highlightJSON(text: string) {
  return highlight(text, { language: 'json', ignoreIllegals: true });
}

function concatenateLines(text: string) {
  return text.replace(/\s{2,}/g, ' ').replace(/(\r?\n)+/g, ' ');
}
