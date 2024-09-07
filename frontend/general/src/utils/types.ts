export type SortOption = "newest" | "oldest" | "popular";

export interface Topic {
  id: number;
  name: string;
}
export interface Blog {
  id: number;
  title: string;
  content: string;
  authorId: number;
  blogImageURL: string;
  createdAt: string;
  active: boolean;
  _count: {
    likedByUsers?: number;
    savedByUsers?: number;
  };
  comments: CommentType[];
}
export type MostfollowedUser = {
  id: number;
  username: string;
  profilePicURL: string;
  _count: {
    followers: number;
  };
};
export type SelfDetailsType = {
  id?: number;
  name?: string;
  description?: string;
  password?: string;
  username?: string;
  email?: string;
  profilePicURL?: string;
  notifications?: string[];
  likedBlogs?: Blog[];
  savedBlogs?: Blog[];
  favoriteTopics?: Topic[];
  following?: MostfollowedUser[];
  followers?: MostfollowedUser[];
  blogs?: Blog[];
};
export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export type BlogDetailsType = {
  authorId: number;
  blogImageURL: string;
  comments: CommentType[];
  content: string;
  createdAt: string;
  id: number;
  title: string;
  topics: Topic[];
  _count: {
    likedByUsers: number;
  };
};
export type UserDetailsType = {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  profilePicURL?: string;
  description?: string;
  _count?: {
    followers?: number;
    following?: number;
  };
  blogs?: Blog[];
};
export type CommentType = {
  active: boolean;
  authorId: number;
  blogId: number;
  content: string;
  createdAt: string;
  id: number;
};
export type AuthorCardType = {
  id?: number;
  username?: string;
  profilePicURL?: string;
};
export type UserBlogsType = {
  liked: number[];
  saved: number[];
};
export type UserSearchCardType = {
  id: number;
  username: string;
  name: string;
  profilePicURL: string;
  _count: {
    followers: number;
    blogs: number;
  };
};
