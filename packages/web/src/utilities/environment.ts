export const isProduction = process.env.NODE_ENV === 'production';

// For testing over the network, change localhost to the address of your computer in the network
export const localServerHostname = 'localhost';

// Content server
const publicContentServerHostname = 'api.warestacks.com';

export const contentServerHostname = isProduction
  ? publicContentServerHostname
  : `${localServerHostname}:8080`;
export const contentServerURL = `https://${contentServerHostname}`;
