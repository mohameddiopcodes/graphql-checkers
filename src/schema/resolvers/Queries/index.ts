import UserQueries from "./Users";
import GameQueries from "./Games";

const Queries = {
  ...UserQueries,
  ...GameQueries,
};

export default Queries;
