# @warestacks/content-server

A Node.js server that provides the [GraphQL](https://graphql.org/) API for WareStacks. It serves warehouse listings, handles booking, pricing and contact requests, and stores data in [MongoDB](https://www.mongodb.com/). It is built with:

- **[Express](https://github.com/expressjs/express#readme)** as the web server
- **[Mongoose](https://github.com/Automattic/mongoose#readme)** for schema validation and other extensions to MongoDB, such as virtual fields
- **[GraphQL Compose Mongoose](https://github.com/graphql-compose/graphql-compose-mongoose)** to generate GraphQL types from the Mongoose schemas
- **[Apollo Server](https://github.com/apollographql/apollo-server#readme)** to handle GraphQL requests
- **[Resend](https://resend.com/)** to send transactional emails
- **[ESLint](https://github.com/eslint/eslint#readme)** with the [Airbnb config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#readme) for consistent code quality

In production it runs on Google Cloud App Engine and loads its secrets from Google Cloud Secret Manager.

## Setting up

Install the workspace dependencies from the root of the repository first (see the [main README](../../README.md#getting-started)). Then:

1. Install [MongoDB Server](https://www.mongodb.com/try/download/community).
2. Run MongoDB as a replica set:
   1. Start the daemon with `mongod --replSet "rs0"`. If you run MongoDB as a service, add the following to `mongod.cfg` and restart the service instead:

      ```cfg
      replication:
        replSetName: rs0
      ```

   2. In the `mongosh` shell, start the replica set with `rs.initiate()`.
3. Generate a TLS certificate for local development:
   1. Install [mkcert](https://github.com/FiloSottile/mkcert#readme).
   2. Run `mkcert -install` with elevated privileges to install a local root CA.
   3. Create a `tls` directory inside `content-server`, change into it and run `mkcert localhost 127.0.0.1 ::1`. Add more hostnames if you need them, such as your local IP address.
   4. Rename the key to `key.pem` and the certificate to `certificate.pem`.
   5. Copy the root CA certificate (`rootCA.pem`, found with `mkcert -CAROOT`) into the `tls` directory.
4. Create a `.env` file in this directory with the variables listed in the [main README](../../README.md#environment-variables).
5. To load test data, run `yarn scripts`, choose `initializeDatabase` and wait for it to finish.
6. Start the development server with `yarn dev`. It restarts whenever a source file changes.

## Deployment

See the [deployment section](../../README.md#deployment) of the main README.
