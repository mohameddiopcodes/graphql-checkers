## GraphQL Checkers

This repository exposes a Typescript [graphql-yoga](https://github.com/dotansimha/graphql-yoga) server on port `:4000/graphql`. This server has built-in User authentication with password hashing and jsonwebtoken signed cookies. It manages sessions by storing them in the database alongside access tokens. Sessions expire the following day, once a session has expired, the access token which is valid for a month and never shared with the browser is used to generate a new session.

Users can start checkers games, appoint opponents and subscribe to a stream of data outputing an event each time a move has been made or a player has joined the game.

### Resolver functions

* Queries:
    - `authorizeUser(user)`: User Login
    - `readUser(id)`: Get a User's information by Id
    - `myAccount`: Get my information
    - `myGames(mod)`: Get all my games, only games I started or only games I have joined.
* Mutations:
    - `createUser(user)`: User SignUp
    - `updateUser(user)`: Update a user's information
    - `deleteUser`: Delete a user from the database
    - `newGame(opponentId, boardSize)`: Create a game, assign an opponent, choose sizes between 8 and 12
    - `joinGame(gameId)`: Officially join a game, this resolver function emits an event after having updated the player's status from passive to active.
    - `move(gameId, start {x y}, end {x y})`: Move a chip from position start to position end and emit a move event to players.

* Subscriptions:
    - `joinGame(gameId)`: Subscribe to a stream of events happening in a game.

### Technologies Used

- `Typescript`: Programming Language
- `GraphQL Yoga`: GraphQL Server Implementation
- `Mongoose`: ORM
- `Express`: Server
- `bcryptjs`: Hashing Library
- `jsonwebtoken`: JWT Implementation with decode ability

### Game Logic

Checkers is an international strategy game played on a board.

- #### Rules:
    1. Boards are `8x8`, `10x10` or `12x12`
    2. A `chip` can only `move away from with camp`
    3. A `capture` happens when jumping over an opponent's chip
    4. A `chip gets crowned` once it reaches its `opponent's camp`
    5. `crowned chips` can move forward and backwards
- [Example](https://serious-checkers.vercel.app).

### Validations
    User:
        
        - Email must be unique
        - Password must be correct (conform with hash)
        - Authenticated with valid cookie (see utils)

    Games:

        - User must be playerOne or playerTwo
        - Start of move must be a chip
        - End of move must be vacant or opponent

### Install command:
- `npm (or yarn/pnpm/bun) install`
### dev command


use `npm run dev` to run the development server then visit `http://localhost:4000/graphql` to view a [GraphiQL](https://github.com/graphql/graphiql) interactive IDE or `http://localhost:4000` for extra information about [graphql-yoga](https://github.com/dotansimha/graphql-yoga).

### build command

use `npm run build`. The generated build can be found in the `./dist` folder.

### start command

use `npm start` then visit port `:4000/graphql` for the [GraphiQL](https://github.com/graphql/graphiql) interactive IDE or `:4000` for extra information about [graphql-yoga](https://github.com/dotansimha/graphql-yoga)

