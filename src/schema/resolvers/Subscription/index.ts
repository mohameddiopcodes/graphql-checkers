import { PubSub } from "graphql-yoga";
import { DBType } from "src/db/types";

const Subscription = {
  count: {
    subscribe: (
      parent: any,
      args: any,
      { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
    ) => {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", { count });
      }, 500);
      return pubsub.subscribe("count");
    },
  },
  post: {
    subscribe: (
      parent: any,
      args: any,
      { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
    ) => {
      return pubsub.subscribe("post");
    },
  },
  comment: {
    subscribe: (
      parent: any,
      args: { postId: string },
      { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
    ) => {
      const post = db.posts.find(
        (post) => post.id === args.postId && post.published
      );

      if (!post) {
        throw new Error("Post not found");
      }

      return pubsub.subscribe(`${args.postId}#comment`);
    },
  },
};

export default Subscription;
