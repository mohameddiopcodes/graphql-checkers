import UserMutations from "./Users";
import GameMutations from "./Games";

const Mutations = {
  ...UserMutations,
  ...GameMutations,
};

export default Mutations;
