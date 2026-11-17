# @warestacks/web

The WareStacks web app, built with [Next.js](https://nextjs.org/) (App Router), React, TypeScript and Tailwind CSS. It talks to the [content server](../content-server) through its GraphQL API.

## Running locally

From the root of the repository, install dependencies if you haven't already:

```bash
yarn install
```

Then start the development server from this directory:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically when you edit files under `app/`.

Make sure the content server is running as well, so the app can load warehouse listings.
