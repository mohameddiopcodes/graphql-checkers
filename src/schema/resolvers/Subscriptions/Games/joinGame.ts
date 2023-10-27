import { GraphQLError } from "graphql";
import { connectGame } from "src/db/controllers/Games";

const joinGame = {
  subscribe: async (parent: any, args: any, { req, res, pubsub }: any) => {
    try {
      await connectGame(req, res, args);
    } catch (e: any) {
      throw new GraphQLError(e.message);
    }
    return pubsub.subscribe(args.gameId);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

export default joinGame;
