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

type SortOption = "newest" | "oldest" | "popular";
function sortBlogsBy(sortBy: SortOption) {
  if (sortBy === "newest") {
    return (a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    };
  } else if (sortBy === "oldest") {
    return (a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    };
  } else if (sortBy === "popular") {
    return (a, b) => {
      return b._count.likedByUsers - a._count.likedByUsers;
    };
  }
}

blogRouter.post("/", async function (c) {
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
      select: {
        id: true,
        blogImageURL: true,
        title: true,
        comments: true,
        content: true,
        createdAt: true,
        _count: {
          select: {
            likedByUsers: true,
          },
        },
      },
    });
    await allBlogs.sort(sortBlogsBy(body.sortBy));
    const totalBlogs = await prisma.blog.count();
    return c.json({ success: true, data: { allBlogs, totalBlogs } });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});
blogRouter.post("/search", async function (c) {
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
      select: {
        id: true,
        title: true,
        content: true,
        blogImageURL: true,
        authorId: true,
        comments: true,
        topics: true,
        createdAt: true,
        _count: {
          select: { likedByUsers: true },
        },
      },
    });
    await queriedBlogs.sort(sortBlogsBy(body.sortBy));
    const totalBlogs = await prisma.blog.count({
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
    });
    return c.json({
      success: true,
      data: { allBlogs: queriedBlogs, totalBlogs },
    });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});
blogRouter.post("search/:topic", async function (c) {
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
    const topic = c.req.param("topic");
    const queriedBlogs = await prisma.blog.findMany({
      where: {
        topics: {
          some: { name: { contains: topic, mode: "insensitive" } },
        },
      },
      skip: (body.currentPage - 1) * c.env?.pageContentLimitForBlogs,
      take: c.env?.pageContentLimitForBlogs,
      select: {
        id: true,
        title: true,
        content: true,
        blogImageURL: true,
        authorId: true,
        comments: true,
        topics: true,
        createdAt: true,
        _count: {
          select: { likedByUsers: true },
        },
      },
    });
    await queriedBlogs.sort(sortBlogsBy(body.sortBy));
    const totalBlogs = await prisma.blog.count({
      where: {
        topics: {
          some: { name: { contains: topic, mode: "insensitive" } },
        },
      },
    });
    return c.json({
      success: true,
      data: { allBlogs: queriedBlogs, totalBlogs },
    });
    // return c.json({ success: true, data: queriedBlogs });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});
blogRouter.get("/:blogid", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const blogId = parseInt(c.req.param("blogid"));
    const blog = await prisma.blog.findFirst({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        content: true,
        blogImageURL: true,
        authorId: true,
        comments: true,
        topics: true,
        createdAt: true,
        _count: {
          select: { likedByUsers: true },
        },
      },
    });
    if (!blog) {
      return c.json({
        success: false,
        error: "Something went wrong! No such blog exist!",
      });
    }
    return c.json({ success: true, data: blog });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the blogs!",
    });
  }
});

export default blogRouter;
