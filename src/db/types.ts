export type DBType = {
  users: UsersType;
  posts: PostsType;
  comments: CommentsType;
};

export type UsersType = Array<{
  id: string;
  name: string;
  email: string;
  age?: number | null;
}>;

export type PostsType = Array<{
  id: string;
  title: string;
  body: string;
  published: boolean;
  author: string;
}>;

export type CommentsType = Array<{
  id: string;
  text: string;
  author: string;
  post: string;
}>;
