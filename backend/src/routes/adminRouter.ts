import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  adminTopicAddInput,
  adminTopicEditInput,
  adminTopicDeleteInput,
  deleteBlogInput,
  commentDeleteInput,
  adminUserDeleteInput,
  photoInput,
} from "@anishdhomase/blog_app";

const adminRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    ADMIN_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

adminRouter.post("/signup", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    if (body.password !== c.env.ADMIN_SECRET) {
      c.status(400);
      return c.json({ success: false, error: "You are Unauthorized!" });
    }
    const newAdmin = await prisma.admin.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign(
      { adminId: newAdmin.id, permission: "admin" },
      c.env.JWT_SECRET
    );
    return c.json({ success: true, data: { token: `Bearer ${token}` } });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to create admin!",
    });
  }
});
adminRouter.post("/signin", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const foundAdmin = await prisma.admin.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!foundAdmin) {
      c.status(400);
      return c.json({
        success: false,
        error: "No such admin found!",
      });
    }
    const token = await sign(
      { adminId: foundAdmin.id, permission: "admin" },
      c.env?.JWT_SECRET
    );
    return c.json({ success: true, data: { token: `Bearer ${token}` } });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to signin!",
    });
  }
});

// 🟢 Auth Middleware 🟢
adminRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(400);
    return c.json({ success: false, error: "You are Unauthorized!" });
  }
  try {
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || payload.permission !== "admin") {
      c.status(400);
      return c.json({ success: false, error: "You are Unauthorized!" });
    }
    c.set("jwtPayload", payload.adminId);
    await next();
  } catch {
    c.status(401);
    return c.json({ success: false, error: "You are Unauthorized!" });
  }
});
// Edit Profile photo
adminRouter.post("/photo", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = photoInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const adminId = c.get("jwtPayload");
    const updatedAdmin = await prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        profilePicURL: body.url,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to upload Profile photo!",
    });
  }
});
// Get User Details
adminRouter.get("/details", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const adminId = c.get("jwtPayload");
    const adminDetails = await prisma.admin.findFirst({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        password: true,
        profilePicURL: true,
        createdAt: true,
      },
    });
    return c.json({ success: true, data: adminDetails });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to get your details!",
    });
  }
});
// Topics
adminRouter.post("/topic", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = adminTopicAddInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    let formattedTopic = body.topic.toLowerCase();
    formattedTopic = formattedTopic[0].toUpperCase() + formattedTopic.slice(1);
    await prisma.topic.create({
      data: {
        name: formattedTopic,
      },
    });
    return c.json({ success: true });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to create new topic!",
    });
  }
});
adminRouter.put("/topic", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = adminTopicEditInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.topic.update({
      where: {
        id: body.topicId,
      },
      data: {
        name: body.topic,
      },
    });
    return c.json({ success: true });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to edit the topic!",
    });
  }
});
adminRouter.delete("/topic", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = adminTopicDeleteInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.topic.delete({
      where: {
        id: body.topicId,
      },
    });
    return c.json({ success: true });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to delete the topic!",
    });
  }
});
// Blogs
adminRouter.delete("/blog", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const blogToDelete = await prisma.blog.findFirst({
      where: {
        id: body.blogId,
      },
      select: {
        authorId: true,
        title: true,
      },
    });
    if (!blogToDelete) {
      c.status(400);
      return c.json({ success: false, error: "No such blog found!" });
    }
    const userWhosBlogToDelete = await prisma.user.findFirst({
      where: {
        id: blogToDelete.authorId,
      },
      select: {
        id: true,
      },
    });
    await prisma.blog.delete({
      where: {
        id: body.blogId,
      },
    });
    // await prisma.blog.update({
    //   where: {
    //     id: body.blogId,
    //   },
    //   data: {
    //     active: false,
    //   },
    // });
    const newNotification = `Admin deleted your ${blogToDelete?.title} blog!`;
    await prisma.user.update({
      where: {
        id: userWhosBlogToDelete?.id,
      },
      data: {
        notifications: {
          push: newNotification,
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      e,
      error: "Something went wrong! Unable to delete the blog!",
    });
  }
});
// Comment
adminRouter.delete("/comment", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = commentDeleteInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const commentToDelete = await prisma.comment.findFirst({
      where: {
        id: body.commentId,
      },
      select: {
        authorId: true,
        content: true,
      },
    });
    if (!commentToDelete) {
      c.status(400);
      return c.json({ success: false, error: "No such comment found!" });
    }
    const userWhosCommentToDelete = await prisma.user.findFirst({
      where: {
        id: commentToDelete.authorId,
      },
      select: {
        id: true,
      },
    });
    await prisma.comment.delete({
      where: {
        id: body.commentId,
      },
    });
    // await prisma.comment.update({
    //   where: {
    //     id: body.commentId,
    //   },
    //   data: {
    //     active: false,
    //   },
    // });
    const newNotification = `Admin deleted your '${commentToDelete?.content}' Comment!`;
    await prisma.user.update({
      where: {
        id: userWhosCommentToDelete?.id,
      },
      data: {
        notifications: {
          push: newNotification,
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      e,
      error: "Something went wrong! Unable to delete the comment!",
    });
  }
});
// User
adminRouter.delete("/user", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = adminUserDeleteInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.user.delete({
      where: {
        id: body.userId,
      },
    });
    // await prisma.user.update({
    //   where: {
    //     id: body.userId,
    //   },
    //   data: {
    //     active: false,
    //   },
    // });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to delete the user!",
    });
  }
});

export default adminRouter;
