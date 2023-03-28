import fs from "fs";
import path from "path";

const typeDefs = fs.readFileSync(path.join(__dirname, "./schema.gql"), "utf8");

export default typeDefs;
