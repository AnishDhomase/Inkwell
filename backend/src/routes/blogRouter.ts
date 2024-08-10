import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.get("/", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const allBlogs = await prisma.blog.findMany({});
    return c.json({ success: true, data: allBlogs });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch blogs!",
    });
  }
});

export default blogRouter;
