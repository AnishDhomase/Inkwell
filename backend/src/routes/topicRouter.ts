import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  profileDescription,
  profileTopics,
} from "@anishdhomase/blog_app";

const topicRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

topicRouter.get("/", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const allTopics = await prisma.topic.findMany({});
    return c.json({ success: true, data: allTopics });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch topics!",
    });
  }
});

export default topicRouter;
