import { PubSub } from "graphql-yoga";
import { DBType } from "src/db/types";

import uuid from "uuid4";

const Mutation = {
  createUser: (
    parent: any,
    args: { data: { name: string; email: string; age?: number } },
    { db }: { db: DBType }
  ) => {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email taken.");
    }
    const user = {
      id: uuid(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },
  updateUser: (
    parent: any,
    args: {
      id: string;
      data: { name?: string; email?: string; age?: number | null };
    },
    { db }: { db: DBType }
  ) => {
    const user = db.users.find((user) => user.id === args.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (args.data.email) {
      const emailTaken = db.users.some(
        (user) => user.email === args.data.email
      );
      if (emailTaken) {
        throw new Error("Email taken");
      }
      user.email = args.data.email;
    }

    if (args.data.name) {
      user.name = args.data.name;
    }

    if (typeof args.data.age !== "undefined") {
      user.age = args.data.age;
    }
    return user;
  },
  deleteUser: (parent: any, args: any, { db }: { db: DBType }) => {
    const found = db.users.findIndex((user) => user.id === args.id);
    if (found === -1) {
      throw new Error("User not found");
    }
    const deletedUsers = db.users.splice(found, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === deletedUsers[0].id;
      if (match) {
        db.comments.filter((comment) => comment.post !== post.id);
      }
      return !match;
    });
    db.comments = db.comments.filter(
      (comment) => comment.author !== deletedUsers[0].id
    );
    return deletedUsers[0];
  },
  createPost: (
    parent: any,
    args: any,
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const userExists = db.users.some((user) => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }
    const post = {
      id: uuid(),
      ...args.data,
    };
    db.posts.push(post);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },
  updatePost: (
    parent: any,
    args: {
      id: string;
      data: { title?: string; body?: string; published?: boolean };
    },
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const post = db.posts.find((post) => post.id === args.id);
    const originalPost = { ...post };
    if (!post) {
      throw new Error("Post not found");
    }
    if (args.data.title) {
      post.title = args.data.title;
    }
    if (args.data.body) {
      post.body = args.data.body;
    }
    if (typeof args.data.published !== "undefined") {
      post.published = args.data.published;
      if (originalPost.published && !post.published) {
        //DELETED
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      }
    }
    if (post.published) {
      if (!originalPost.published) {
        //CREATED
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      } else {
        //UPDATED
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    }
    return post;
  },
  deletePost: (
    parent: any,
    args: any,
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const found = db.posts.findIndex((post) => post.id === args.id);
    if (found === -1) {
      throw new Error("Post not found");
    }
    const deletedPosts = db.posts.splice(found, 1);
    db.comments = db.comments.filter((comment) => {
      return comment.post !== deletedPosts[0].id;
    });
    if (deletedPosts[0].published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPosts[0],
        },
      });
    }
    return deletedPosts[0];
  },
  createComment: (
    parent: any,
    args: any,
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const userExists = db.users.some((user) => user.id === args.data.author);
    const postExists = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );
    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }
    const comment = {
      id: uuid(),
      ...args.data,
    };
    db.comments.push(comment);
    pubsub.publish(`${args.data.post}#comment`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  },
  updateComment: (
    parent: any,
    args: { id: string; data: { text: string } },
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const comment = db.comments.find((comment) => comment.id === args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    comment.text = args.data.text;
    pubsub.publish(`${comment.post}#comment`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment: (
    parent: any,
    args: any,
    { db, pubsub }: { db: DBType; pubsub: PubSub<any> }
  ) => {
    const found = db.comments.findIndex((comment) => comment.id === args.id);
    if (found === -1) {
      throw new Error("Comment not found");
    }
    const deletedComments = db.comments.splice(found, 1);
    pubsub.publish(`${deletedComments[0].post}#comment`, {
      comment: {
        mutation: "DELETED",
        data: deletedComments[0],
      },
    });
    return deletedComments[0];
  },
};

export default Mutation;
