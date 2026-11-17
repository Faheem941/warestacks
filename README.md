# WareStacks

**Live site:** [warestacks-web.vercel.app](https://warestacks-web.vercel.app/)

WareStacks is a web platform for finding and booking warehouse space. Businesses can search for warehouses by location, filter listings by price, and send booking or pricing requests straight from a listing. Each request triggers a confirmation email to the customer and a notification to the sales team.

The project is a TypeScript monorepo with a Next.js front end, a GraphQL content server backed by MongoDB, and a shared library of types and utilities. The web app is deployed on Vercel and the content server on Google Cloud App Engine.

## Screenshots

![WareStacks home page with location search](docs/screenshots/home.jpg)

![Platform features section](docs/screenshots/features.jpg)

![Pricing plans](docs/screenshots/pricing.jpg)

## Features

- Location search for warehouse listings
- Price filtering
- Booking and pricing request forms, with automated confirmation emails
- Contact form with email notifications
- Responsive layout optimised for mobile

## Repository structure

| Package | Description |
|---|---|
| [`@warestacks/web`](packages/web) | Next.js web app for end users |
| [`@warestacks/content-server`](packages/content-server) | Node.js GraphQL API that serves content and handles database operations |
| [`@warestacks/common`](packages/common) | Types and utilities shared by the other packages |

The packages are managed as Yarn workspaces, so dependencies for all of them are installed from the root.

## Tech stack

- **Front end:** Next.js, React, TypeScript, Tailwind CSS
- **Back end:** Node.js, Express, Apollo Server, GraphQL Compose, Mongoose
- **Database:** MongoDB
- **Email:** Resend
- **Infrastructure:** Vercel, Google Cloud App Engine, Cloud Storage, Secret Manager
- **Tooling:** Yarn workspaces, ESLint, Prettier

## Getting started

### Prerequisites

- Node.js 20.9.0
- Yarn Classic (v1)
- MongoDB (running as a replica set for local development)

### Install

```bash
git clone https://github.com/Faheem941/warestacks.git
cd warestacks
yarn install
```

Then follow the setup steps in each package's README:

- [Web app setup](packages/web/README.md)
- [Content server setup](packages/content-server/README.md)

### Environment variables

For local development the content server reads its secrets from a `.env` file in `packages/content-server`. This file is not committed. In production the same values are loaded from Google Cloud Secret Manager.

| Variable | Purpose |
|---|---|
| `databaseURL` | MongoDB connection string |
| `cookieSecret` | Secret used to sign session cookies |
| `RESEND_API_KEY` | API key for sending emails through Resend |

## Deployment

The web app is deployed on Vercel.

The content server runs on Google Cloud App Engine. Its configuration is in `content-server.yaml`, and `dispatch.yaml` holds the routing rules. Before deploying, run the linter and tests:

```bash
yarn lint
yarn test
```

Then deploy from the root of the repository:

```bash
gcloud app deploy content-server.yaml
```

## Development guidelines

- Work on a feature branch and open a pull request into `develop`.
- Lint your code before committing.
- Put code used by more than one package into `@warestacks/common`.
- Don't edit generated files. Change the script that generates them instead.
