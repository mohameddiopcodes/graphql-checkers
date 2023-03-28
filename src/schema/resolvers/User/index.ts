import { DBType } from "src/db/types";

const User = {
  posts: (parent: any, args: any, { db }: { db: DBType }) => {
    return db.posts.filter((post) => post.author === parent.id);
  },
  comments: (parent: any, args: any, { db }: { db: DBType }) =>
    db.comments.filter((comment) => comment.author === parent.id),
};

export default User;
