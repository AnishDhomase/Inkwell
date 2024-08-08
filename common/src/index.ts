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

export type profileTopicsType = z.infer<typeof profileTopics>;
export type profilePhotoType = z.infer<typeof profilePhoto>;
export type SignupType = z.infer<typeof signupInput>;
export type SigninType = z.infer<typeof signinInput>;
