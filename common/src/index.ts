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
export const profilePhoto = z.object({
  profilePic: z.string(),
});
export const profileTopics = z.object({
  favoriteTopics: z.array(z.number()),
});
export const blogInput = z.object({
  title: z.string().max(100),
  content: z.string().max(1000),
  topics: z.array(z.number()),
});
export const blogUpdateInput = z.object({
  id: z.number(),
  title: z.string().max(100),
  content: z.string().max(1000),
  topics: z.array(z.number()),
});
export const commentInput = z.object({
  blogId: z.number(),
  content: z.string().max(1000),
});
export const commentEditInput = z.object({
  commentId: z.number(),
  content: z.string().max(1000),
});

export type commentEditInputType = z.infer<typeof commentEditInput>;
export type commentInputType = z.infer<typeof commentInput>;
export type blogUpdateInputType = z.infer<typeof blogUpdateInput>;
export type blogInputType = z.infer<typeof blogInput>;
export type profileTopicsType = z.infer<typeof profileTopics>;
export type profilePhotoType = z.infer<typeof profilePhoto>;
export type SignupType = z.infer<typeof signupInput>;
export type SigninType = z.infer<typeof signinInput>;
