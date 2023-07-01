type Post = {
  id: string;
  title: string;
  body: string;
  subName: string;
  avatar: string;
  username: string;
  createdAt: { seconds: number };
  voteScore: number;
  commentCount: number;
};

type User = {
  id: string;
  displayName: string;
  avatar: string;
  createdAt: { seconds: number };
  banner: string;
  email: string;
  username: string;
  uid: string;
} | null;

type Sub = {
  id: string;
  createdAt: { seconds: number };
  name: string;
  title: string;
  description: string;
  avatar: string;
  banner: string;
  username: string;
  postCount: number;
};

type Vote = {
  uid: string;
  postId?: string;
  commentId?: string;
  isUpVote: boolean;
};
