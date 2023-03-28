## Sample GraphQL Project

This sample repository exposes a Typescript [graphql-yoga](https://github.com/dotansimha/graphql-yoga) server on port `:4000/graphql`.

### Supported Operations

* Queries for `users`, `posts` and `comments`
* Mutations to create, update and delete a `User`, a `Post` and a `Comment`
* Subscriptions to all theses Mutation events through the `post` and `comment` subscriptions.

### install command

* `npm install`, `yarn install` or `pnpm install`

### dev command

use `npm run dev` to run the development server then visit `http://localhost:4000/graphql` to view a [GraphiQL](https://github.com/graphql/graphiql) interactive IDE or `http://localhost:4000` for extra information about [graphql-yoga](https://github.com/dotansimha/graphql-yoga).

### build command

use `npm run build`. The generated build can be found in the `./dist` folder.

### start command

use `npm start` then visit port `:4000/graphql` for the [GraphiQL](https://github.com/graphql/graphiql) interactive IDE or `:4000` for extra information about [graphql-yoga](https://github.com/dotansimha/graphql-yoga)

