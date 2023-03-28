import { DBType } from "src/db/types";

const Post = {
  author: (parent: any, args: any, { db }: { db: DBType }) =>
    db.users.find((user) => user.id === parent.author),
  comments: (parent: any, args: any, { db }: { db: DBType }) =>
    db.comments.filter((comment) => comment.post === parent.id),
};

export default Post;
