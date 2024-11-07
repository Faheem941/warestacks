import { google } from 'googleapis';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import { isProduction } from './environment';
import { printError } from './log';

interface ILogEvent {
  eventName: string;
  eventProperties: Record<string, any>;
}

export const logs: ILogEvent[] = [];

type BucketName = 'warestacks-com-cdn';

export const storageUrl = 'https://storage.googleapis.com';

/* ------------------------------- Google APIs utility functions -------------------------------- */

export function logGAEvent(
  eventName: string,
  eventProperties: Record<string, string | number> = {},
) {
  logs.push({ eventName, eventProperties });
}

export function getBucketName(): BucketName {
  return `warestacks-com-cdn`;
}

export function getBucketUrl(): string {
  return `https://storage.googleapis.com/${getBucketName()}`;
}

/* ----------------------------------------- Secrets 🤫 ----------------------------------------- */

const secretManagerClient = new SecretManagerServiceClient();

const secretNames = ['cookieSecret', 'databaseURL', 'RESEND_API_KEY'] as const;

const secrets: Partial<Record<(typeof secretNames)[number], string>> = {};

async function accessSecret(name: (typeof secretNames)[number], projectId: string) {
  let secretResult: undefined | string;

  try {
    const [accessResponse] = await secretManagerClient.accessSecretVersion({
      name: `projects/${projectId}/secrets/${name}/versions/latest`,
    });
    secretResult = accessResponse.payload?.data?.toString();
  } catch {
    // Can't get secret
  }

  if (!secretResult) {
    printError(`Secret called "${name}" could not be accessed.`);
    process.exit(1);
  }

  return secretResult;
}

export async function initializeSecrets() {
  const projectId = await google.auth.getProjectId();

  await Promise.all(
    secretNames.map(async (secretName) => {
      secrets[secretName] = await accessSecret(secretName, projectId);
    }),
  );
}

export async function getSecret(name: (typeof secretNames)[number]): Promise<string> {
  const secret = secrets[name];
  if (secret) {
    return secret;
  }

  // this is faster for development, we use .env for development because caching and fetching secrets from gcp each time server is restarted is slow
  // .env uses a mix of dev and prod keys
  // TODO remove prod keys from .env and create proper use dev keys
  if (!isProduction) {
    return process.env[name] ?? 'unknown';
  }

  const projectId = await google.auth.getProjectId();
  return accessSecret(name, projectId);
}
