import Queries from "./Queries";
import Mutations from "./Mutations";
import Subscriptions from "./Subscriptions";

const resolvers = {
  Query: Queries,
  Mutation: Mutations,
  Subscription: Subscriptions,
};

export default resolvers;
