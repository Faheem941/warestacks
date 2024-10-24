import './mutations';
import './queries';

import { schemaComposer } from 'graphql-compose';

import { selfTypeComposer, userTypeComposer, warehouseLocationTypeComposer } from './graphql';

/* ------------------------------------------- Queries ------------------------------------------ */

schemaComposer.Query.addFields({
  // User queries
  self: selfTypeComposer.getResolver('self'),
  isSelfBanned: userTypeComposer.getResolver('isSelfBanned'),

  // warehouse queries
  getLocations: warehouseLocationTypeComposer.getResolver('getLocations'),
});

/* ----------------------------------------- Mutations ------------------------------------------ */

schemaComposer.Mutation.addFields({
  // Authentication mutations
  logout: selfTypeComposer.getResolver('logout'),
  registerUser: selfTypeComposer.getResolver('registerUser'),
  login: selfTypeComposer.getResolver('login'),
});

export default schemaComposer.buildSchema();
