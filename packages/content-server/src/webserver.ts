// Set up error handling before local modules are loaded
import './error';

import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
// import { GraphQLRequestContext } from 'apollo-server-types';
import { DatastoreStore } from '@google-cloud/connect-datastore';
import { Datastore } from '@google-cloud/datastore';
import chalk from 'chalk';
import compression from 'compression';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express, { Express, NextFunction, Request, Response } from 'express';
import session, { CookieOptions } from 'express-session';
import { execute } from 'graphql';
import depthLimit from 'graphql-depth-limit';
// eslint-disable-next-line import/extensions
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import helmet, { HelmetOptions } from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

// import { Handlers, captureException, withScope } from '@sentry/node';

import graphQLSchema from './api';
import { connect } from './mongoose';
import {
  developmentOrigins,
  isProduction,
  isProductionTest,
  productionOrigins,
  webDomain,
} from './utilities/environment';
import { getSecret } from './utilities/gapis';
import {
  graphQueryLogger,
  graphResponseLogger,
  morganGenerator,
  print,
  printError,
  printInfo,
} from './utilities/log';

declare module 'express-session' {
  export interface SessionData {
    email?: string;
    role?: 'admin' | 'user';
  }
}

const origins = [
  ...(!isProduction || isProductionTest ? developmentOrigins : []),
  ...productionOrigins,
  'https://studio.apollographql.com',
];

/* --------------------------------------- Webserver setup -------------------------------------- */

export default async function createWebserver(databaseAddress: string, logLevel: number) {
  // Connect to MongoDB Database
  print('Connecting to the database....\n');

  try {
    await connect(databaseAddress);
  } catch (err) {
    printError("Couldn't connect to the database.");
    process.exit(1);
  }

  print(`Connected to MongoDB server at ${chalk.blue(databaseAddress)}`);

  // Create Express app
  const { app } = await createApp(logLevel);

  // Create Websocket and Apollo server
  return createServer(app, logLevel);
}

/* ------------------------------------------- Helpers ------------------------------------------ */

type CSPDirectives = Exclude<
  HelmetOptions['contentSecurityPolicy'],
  boolean | undefined
>['directives'];

async function createApp(logLevel: number) {
  const app = express();

  // Required because of GCloud proxy
  app.set('trust proxy', 1);

  if (isProduction) {
    // warm up requests
    app.get('/_ah/warmup', (_, response) => response.send('warm up successful'));
  }

  // Content Security Policy
  const cspDirectives: CSPDirectives = isProduction
    ? { 'default-src': "'none'", 'object-src': "'none'", 'require-trusted-types-for': ["'script'"] }
    : // CSP for development needs to allow Apollo Sandbox landing page
      {
        'default-src': 'https://apollo-server-landing-page.cdn.apollographql.com',
        'script-src-elem': [
          'https://apollo-server-landing-page.cdn.apollographql.com',
          "'unsafe-inline'",
        ],
        'style-src': "'unsafe-inline'",
        'style-src-elem': ['https://fonts.googleapis.com', "'unsafe-inline'"],
        'font-src': ['data:', 'https://fonts.gstatic.com'],
        'object-src': "'none'",
        'img-src': 'https://apollo-server-landing-page.cdn.apollographql.com',
      };

  app.use(
    helmet({
      contentSecurityPolicy: { directives: cspDirectives },
      // Needed for Apollo Sandbox landing page
      crossOriginEmbedderPolicy: isProduction,
    }),
  );

  if (logLevel > 0) {
    app.use(morgan(morganGenerator));
  }

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43909
  app.use(
    (_req, _res, next) => next(),
    cors({
      origin: origins,
      credentials: true,
      exposedHeaders: 'CSRF-Token',
    }),
  );

  // Disable CSRF check in development so we can use the graphql playground
  if (isProduction) {
    // Needed for CSRF when cookie set to true
    app.use(cookieParser(await getSecret('cookieSecret')));

    app.use(csrf({ cookie: true }));

    app.use((request, response, next) => {
      // Change CSRF secret on every request
      if (request.method === 'GET' || request.method === 'POST') {
        response.header('CSRF-Token', request.csrfToken());
      }

      next();
    });

    // If the previous CSRF token was invalid, generate a new one, so the client can try again
    // (automatically by Apollo RetryLink)
    app.use(
      (error: NodeJS.ErrnoException, request: Request, response: Response, next: NextFunction) => {
        if (error.code !== 'EBADCSRFTOKEN') {
          return next(error);
        }

        response.header('CSRF-Token', request.csrfToken());
        response.status(403);
        response.send({ error: 'Invalid CSRF token' });

        return undefined;
      },
    );
  }

  const sessionHandler = await createSessionHandler('lax');
  const crossSiteSessionHandler = await createSessionHandler('none');

  // and set its `SameSite` to 'lax'
  app.use((req, res, next) => {
    crossSiteSessionHandler(req, res, next);
  });

  app.use(compression());

  // Needed for GraphQL logger
  app.use(express.json());

  if (logLevel > 0) {
    app.use((_, res, next) => {
      res.send = new Proxy<typeof res.send>(res.send, { apply: graphResponseLogger });
      next();
    });
  }

  app.get('/session', (request, response) => {
    response.json({ email: request.session ? request.session.email : null });
  });

  return { app, sessionHandler };
}

async function createServer(app: Express, logLevel: number) {
  let httpServer: http.Server;
  if (isProduction && !isProductionTest) {
    httpServer = http.createServer(app);
  } else {
    httpServer = https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, '../tls/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../tls/certificate.pem')),
      },
      app,
    );
  }

  app.use(graphqlUploadExpress({ maxFileSize: 50 * 1024 * 1024 }));

  const apolloServer = new ApolloServer({
    debug: !isProduction,
    cache: 'bounded',
    introspection: !isProduction,
    schema: graphQLSchema,
    validationRules: [depthLimit(10)],
    executor:
      logLevel > 0
        ? (executionArgs) => graphQueryLogger(executionArgs, execute, graphQLSchema)
        : undefined,
    formatError:
      logLevel > 0
        ? (error) => {
            printError(`Error while processing GraphQL request: ${error.message}`);

            const stack = error.stack || error.originalError?.stack;
            if (stack) {
              printInfo(stack);
            }

            return error;
          }
        : undefined,
    context({ req }) {
      return {
        session: req.session,
      };
    },
    plugins: [],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: '/api',
    cors: { origin: origins, credentials: true, exposedHeaders: 'CSRF-Token' },
  });

  return httpServer;
}

async function createSessionHandler(sameSite: CookieOptions['sameSite']) {
  return session({
    secret: await getSecret('cookieSecret'),
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite,
      domain: webDomain,
    },
    store: isProduction
      ? new DatastoreStore({ kind: 'express-sessions', dataset: new Datastore() })
      : MongoStore.create({ client: mongoose.connection.getClient() }),
  });
}
