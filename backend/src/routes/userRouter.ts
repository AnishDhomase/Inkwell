import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  profileDescription,
} from "@anishdhomase/blog_app";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async function (c) {
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
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ userId: newUser.id }, c.env?.JWT_SECRET);
    return c.json({ success: true, token });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});
userRouter.post("/signin", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  if (!body.description) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!foundUser) {
      c.status(400);
      return c.json({
        success: false,
        error: "No such user found!",
      });
    }
    const token = await sign({ userId: foundUser.id }, c.env?.JWT_SECRET);
    return c.json({ success: true, token });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Your Inputs are not correct!",
    });
  }
});

// Auth Middleware
userRouter.use(async (c, next) => {
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
    c.set("jwtPayload", payload.userId);
    await next();
  } catch {
    c.status(401);
    return c.json({ success: false, error: "Unauthorized!" });
  }
});
userRouter.post("/:userId/Description", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("jwtPayload");
  const body = await c.req.json();
  const { success } = profileDescription.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({ success: false, error: "Your Inputs are not valid!" });
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      description: body.description,
    },
  });
  return c.json({ success: true, updatedUser });
});

export default userRouter;
