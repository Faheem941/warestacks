import './mutations';
import './queries';

import { schemaComposer } from 'graphql-compose';

import { selfTypeComposer, userTypeComposer } from './graphql';

/* ------------------------------------------- Queries ------------------------------------------ */

schemaComposer.Query.addFields({
  // User queries
  self: selfTypeComposer.getResolver('self'),
  isSelfBanned: userTypeComposer.getResolver('isSelfBanned'),
});

/* ----------------------------------------- Mutations ------------------------------------------ */

schemaComposer.Mutation.addFields({
  // Authentication mutations
  logout: selfTypeComposer.getResolver('logout'),
  registerUser: selfTypeComposer.getResolver('registerUser'),
  login: selfTypeComposer.getResolver('login'),

  // User functionalities
});

export default schemaComposer.buildSchema();
