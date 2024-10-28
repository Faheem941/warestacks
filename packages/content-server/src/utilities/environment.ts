export const isProductionTest = process.argv.includes('--prodtest');
export const isProduction =
  process.env.NODE_ENV === 'production' ||
  isProductionTest ||
  process.argv.includes('--production');
export const isStaging = process.env.IS_STAGING === 'true';

/* ------------------------------------- Hostnames and URLs ------------------------------------- */

// For testing over the network, change localhost to the address of your computer in the network
const localServerHostname = 'localhost';

const webServerHostname =
  isProduction && !isProductionTest ? 'dwms-project-web.vercel.app/' : localServerHostname;
export const webHostname = isStaging ? 'staging.dwms-project-web.vercel.app/' : webServerHostname;
export const webDomain = hostnameToDomain(webHostname);

const contentServerHostname = isStaging ? 'content-staging.dwms.co' : 'content.dwms.co';

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

export const productionOrigins = [`https://${webHostname}`];

export function hostnameToDomain(hostname: string) {
  return hostname.split('.').slice(-2).join('.');
}
