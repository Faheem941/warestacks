import './mutations';
import './queries';

import { schemaComposer } from 'graphql-compose';

import {
  selfTypeComposer,
  userTypeComposer,
  warehouseLocationTypeComposer,
  warehouseProviderTypeComposer,
  warehouseTypeComposer,
} from './graphql';
/* ------------------------------------------- Custom GraphQL Fields ------------------------------------------ */

warehouseTypeComposer.addFields({
  provider: {
    type: warehouseProviderTypeComposer,
  },
  location: {
    type: warehouseLocationTypeComposer,
  },
});

/* ------------------------------------------- Queries ------------------------------------------ */

schemaComposer.Query.addFields({
  // User queries
  self: selfTypeComposer.getResolver('self'),
  isSelfBanned: userTypeComposer.getResolver('isSelfBanned'),

  // warehouse queries
  getLocations: warehouseLocationTypeComposer.getResolver('getLocations'),
  getWarehouses: warehouseTypeComposer.getResolver('getWarehouses'),
});

/* ----------------------------------------- Mutations ------------------------------------------ */

schemaComposer.Mutation.addFields({
  // Authentication mutations
  logout: selfTypeComposer.getResolver('logout'),
  registerUser: selfTypeComposer.getResolver('registerUser'),
  login: selfTypeComposer.getResolver('login'),

  // warehouse mutations
  sendBooking: warehouseTypeComposer.getResolver('sendBooking'),
  sendPriceBooking: warehouseTypeComposer.getResolver('sendPriceBooking'),
});

export default schemaComposer.buildSchema();
