import { DBType } from "src/db/types";

const Comment = {
  author: (parent: any, args: any, { db }: { db: DBType }) =>
    db.users.find((user) => user.id === parent.author),
  post: (parent: any, args: any, { db }: { db: DBType }) =>
    db.posts.find((post) => post.id === parent.post),
};

export default Comment;
