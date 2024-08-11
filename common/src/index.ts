import z from "zod";

export const signupInput = z.object({
  name: z.string().optional(),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const profileTopics = z.object({
  favoriteTopics: z.array(z.number()),
});
export const blogInput = z.object({
  title: z.string().max(100),
  content: z.string().max(1000),
  topics: z.array(z.number()),
  imageURL: z.string().optional(),
});
export const blogUpdateInput = z.object({
  id: z.number(),
  title: z.string().max(100),
  content: z.string().max(1000),
  topics: z.array(z.number()),
  imageURL: z.string().optional(),
});
export const commentInput = z.object({
  blogId: z.number(),
  content: z.string().max(1000),
});
export const commentEditInput = z.object({
  commentId: z.number(),
  content: z.string().max(1000),
});
export const authorDetailsInput = z.object({
  authorId: z.number(),
});
export const userDescriptionInput = z.object({
  description: z.string().max(1000),
});
export const userFollowInput = z.object({
  followId: z.number(),
});
export const deleteBlogInput = z.object({
  blogId: z.number(),
});
export const commentDeleteInput = z.object({
  commentId: z.number(),
});
export const adminTopicAddInput = z.object({
  topic: z.string().max(30),
});
export const adminTopicEditInput = z.object({
  topic: z.string().max(30),
  topicId: z.number(),
});
export const adminTopicDeleteInput = z.object({
  topicId: z.number(),
});
export const adminUserDeleteInput = z.object({
  userId: z.number(),
});
export const photoInput = z.object({
  url: z.string(),
});
export const updateUserDetailsInput = z.object({
  name: z.string().optional(),
  password: z.string().min(6),
  profilePicURL: z.string().optional(),
  description: z.string().max(1000).optional(),
  favoriteTopics: z.array(z.number()).optional(),
});
export const blogSearchInput = z.object({
  query: z.string().min(1),
  currentPage: z.number(),
});
export const pageInput = z.object({
  currentPage: z.number(),
});

export type pageInputType = z.infer<typeof pageInput>;
export type blogSearchInputType = z.infer<typeof blogSearchInput>;
export type updateUserDetailsInputType = z.infer<typeof updateUserDetailsInput>;
export type photoInputType = z.infer<typeof photoInput>;
export type adminUserDeleteInputType = z.infer<typeof adminUserDeleteInput>;
export type adminTopicDeleteInputType = z.infer<typeof adminTopicDeleteInput>;
export type adminTopicEditInputType = z.infer<typeof adminTopicEditInput>;
export type adminTopicAddInputType = z.infer<typeof adminTopicAddInput>;
export type commentDeleteInputType = z.infer<typeof commentDeleteInput>;
export type deleteBlogInputType = z.infer<typeof deleteBlogInput>;
export type userFollowInputType = z.infer<typeof userFollowInput>;
export type userDescriptionInputType = z.infer<typeof userDescriptionInput>;
export type authorDetailsInputType = z.infer<typeof authorDetailsInput>;
export type commentEditInputType = z.infer<typeof commentEditInput>;
export type commentInputType = z.infer<typeof commentInput>;
export type blogUpdateInputType = z.infer<typeof blogUpdateInput>;
export type blogInputType = z.infer<typeof blogInput>;
export type profileTopicsType = z.infer<typeof profileTopics>;
export type SignupType = z.infer<typeof signupInput>;
export type SigninType = z.infer<typeof signinInput>;
