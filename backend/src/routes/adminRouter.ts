import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@anishdhomase/blog_app";

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

  const body = await c.req.json();
  try {
    const { success } = signupInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    if (body.password !== c.env.ADMIN_SECRET) {
      c.status(400);
      return c.json({ success: false, error: "Unauthorized!" });
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
    return c.json({ success: true, token: `Bearer ${token}` });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});
adminRouter.post("/signin", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  if (!body) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  try {
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
    return c.json({ success: true, token: `Bearer ${token}` });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});

// Auth Middleware
adminRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(400);
    return c.json({ success: false, error: "Unauthorized!" });
  }
  try {
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(400);
      return c.json({ success: false, error: "Unauthorized!" });
    }
    c.set("jwtPayload", payload.adminId);
    await next();
  } catch {
    c.status(401);
    return c.json({ success: false, error: "Unauthorized!" });
  }
});
adminRouter.post("/:adminId/topics", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  if (!body) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  try {
    if (!body.topic) {
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
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});
adminRouter.put("/:adminId/topics", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  if (!body) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  try {
    if (!body.topicId || !body.topic) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.topic.updateMany({
      where: {
        id: Number(body.topicId),
      },
      data: {
        name: body.topic,
      },
    });
    return c.json({ success: true });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});
adminRouter.delete("/:adminId/topics", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  if (!body) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  try {
    if (!body.topicId) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.topic.deleteMany({
      where: {
        id: Number(body.topicId),
      },
    });
    return c.json({ success: true });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});

export default adminRouter;
