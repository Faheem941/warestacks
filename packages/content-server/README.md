# template Content Server

A Node.js webserver, which provides a [GraphQL](https://graphql.org/) API for serving content to template project components and perform data operations in a [MongoDB](https://www.mongodb.com/) database. It also uses the following packages:

- **[Express](https://github.com/expressjs/express#readme)** - as the webserver
- **[Mongoose](https://github.com/Automattic/mongoose#readme)** - to add schema validation and other extensions (like virtual fields) to MongoDB
- **[GraphQL Compose Mongoose](https://github.com/graphql-compose/graphql-compose-mongoose)** - to generate GraphQL type definitions from Mongoose schema
- **[Apollo Server Express](https://github.com/apollographql/apollo-server#readme)** - to manage the Apollo Client API requests
- **[ESLint](https://github.com/eslint/eslint#readme)** ([AirBnB config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb#readme)) - for good and consistent code quality

It's currently written in JavaScript with [JSDoc](https://github.com/jsdoc/jsdoc#readme) type comments, but it's planned to be converted to TypeScript for better type sharing and syntax.

In production, it is deployed in a [flexible App Engine environment](https://cloud.google.com/appengine/docs/flexible) on Google Cloud (due to websocket requirements).

## Table of Contents

- [Setting Up](#setting-up)
- [Deployment](#deployment)

## Setting Up

See [development environment setup instructions](../../README.md#setting-up-the-environment) for setting up the template workspace. After that, follow the instructions below to set up `@warestacks/content-server`.

1. Install [MongoDB Server](https://www.mongodb.com/download-center/community)
1. To create MongoDB replica set:

   1. Run MongoDB daemon with `mongod --replSet "rs0"`, or if you are using it as a service, edit `mongod.cfg` (in `C:\Program Files\MongoDB\Server\<version>\bin` on Windows) and include the following in it:

      ```cfg
      replication:
        replSetName: rs0
      ```

      then restart the service.

   1. Inside `mongosh` shell initiate replica set with `rs.initiate()`
   1. You can find more information about creating local replica set on macOS [here](https://dariocarrasquel.com/2020/09/07/how-to-create-a-mongodb-replica-set-in-macos-local-environment/)

1. Generate a TLS certificate for development
   1. Install [MKCert](https://github.com/FiloSottile/mkcert#readme)
   1. Run `mkcert -install` with elevated privileges. This will install a root CA locally, so that you can generate trusted certificates with it.
   1. Create a `tls` directory inside `content-server`, change into it and generate a certificate using `mkcert localhost 127.0.0.1 ::1` (add more hostnames if necessary; e.g. add your local IP address to access your local server through your network)
   1. Rename the key to `key.pem` and the certificate to `certificate.pem`
   1. Find the certificate of the root CA you've just installed (with `mkcert -CAROOT`) and copy it (`rootCA.pem`) to the `tls` directory.
1. To generate test data, open the terminal, navigate to packages/content-server and enter `yarn scripts` select `initializeDatabase` and wait until the script finishes.
1. Open a terminal in VSCode and enter `yarn dev` to start the development server (make sure you have run `yarn install` previously in the root of the environment). It will restart on every source file change.

## Production Run

To connect to the production database instead of the local one, run `yarn dangerous:prodrun`. **Be careful when using this command**, it will perform all operations on the live production database. See more instructions in the [main readme](../../README.md#production-test).

## Deployment

See instructions in the [readme of the repository](../../README.md#deployment-to-google-cloud).
