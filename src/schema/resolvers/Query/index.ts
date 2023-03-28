import { DBType } from "src/db/types";

const Query = {
  users: (parent: any, args: any, { db }: { db: DBType }) => {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query)
    );
  },
  me: () => ({
    id: "abc123",
    name: "Mohamed Diop",
    email: "mohameddiopcodes@gmail.com",
    posts: [1, 2],
  }),
  posts: (parent: any, args: any, { db }: { db: DBType }) => {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const bodyQuery = post.body.toLowerCase().includes(args.query);
      const titleQuery = post.title.toLowerCase().includes(args.query);
      return titleQuery || bodyQuery;
    });
  },
  comments: (parent: any, args: any, { db }: { db: DBType }) => db.comments,
};

export default Query;
