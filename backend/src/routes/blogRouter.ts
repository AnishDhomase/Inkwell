import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogSearchInput, pageInput } from "@anishdhomase/blog_app";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    pageContentLimitForBlogs: number;
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
    const body = await c.req.json();
    const { success } = pageInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid input!" });
    }
    const allBlogs = await prisma.blog.findMany({
      skip: (body.currentPage - 1) * c.env?.pageContentLimitForBlogs,
      take: c.env?.pageContentLimitForBlogs,
    });
    return c.json({ success: true, data: allBlogs });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});
blogRouter.get("/search", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = blogSearchInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid input!" });
    }
    const queriedBlogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: body.query, mode: "insensitive" } },
          { content: { contains: body.query, mode: "insensitive" } },
          {
            topics: {
              some: { name: { contains: body.query, mode: "insensitive" } },
            },
          },
        ],
      },
      skip: (body.currentPage - 1) * c.env?.pageContentLimitForBlogs,
      take: c.env?.pageContentLimitForBlogs,
    });
    return c.json({ success: true, data: queriedBlogs });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});

export default blogRouter;
