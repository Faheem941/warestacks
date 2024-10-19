export const isProductionTest = process.argv.includes('--prodtest');
export const isProduction =
  process.env.NODE_ENV === 'production' ||
  isProductionTest ||
  process.argv.includes('--production');
export const isStaging = process.env.IS_STAGING === 'true';

/* ------------------------------------- Hostnames and URLs ------------------------------------- */

// For testing over the network, change localhost to the address of your computer in the network
const localServerHostname = 'localhost';

const webServerHostname = isProduction && !isProductionTest ? 'dwms.co' : localServerHostname;
export const webHostname = isStaging ? 'staging.dwms.co' : webServerHostname;
export const webDomain = hostnameToDomain(webHostname);

const contentServerHostname = isStaging ? 'content-staging.dwms.co' : 'content.dwms.co';

// Add US East Stream Chat servers so that we can use their webhooks
// https://getstream.io/chat/docs/react/webhooks_overview/?language=javascript#whitelisting-stream-domains
const streamChatServers = ['34.225.10.29', '34.198.125.61', '52.22.78.160', '3.215.161.238'];

export const webUrl = `https://${webHostname}`;
export const contentServerUrl = `https://${contentServerHostname}`;

/* ------------------------------------------ Origins ------------------------------------------- */

export const developmentOrigins = [
  `https://${localServerHostname}:3000`,
  'https://127.0.0.1:3000',
  'https://192.168.1.100:3000',
  'http://localhost:54461',
  'https://studio.apollographql.com',
];

export const productionOrigins = [
  `https://${webHostname}`,

  ...(!isStaging ? ['https://www.dwms.co', ...streamChatServers] : []),
];

export function hostnameToDomain(hostname: string) {
  return hostname.split('.').slice(-2).join('.');
}
