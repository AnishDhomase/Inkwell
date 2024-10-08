import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signupInput,
  signinInput,
  profileTopics,
  blogInput,
  commentInput,
  commentEditInput,
  authorDetailsInput,
  userDescriptionInput,
  userFollowInput,
  deleteBlogInput,
  commentDeleteInput,
  photoInput,
  updateUserDetailsInput,
  blogSearchInput,
  pageInput,
  userSearchInput,
  updateGeneralDetailsInput,
  updatePasswordDetailsInput,
} from "@anishdhomase/blog_app";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    pageContentLimitForUsers: number;
    pageContentLimitForBlogs: number;
  };
  Variables: {
    userId: string;
  };
}>();

// Signup, Signin
userRouter.post("/signup", async function (c) {
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
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ userId: newUser.id }, c.env.JWT_SECRET);
    return c.json({ success: true, data: { token: `Bearer ${token}` } });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to create new account!",
    });
  }
});
userRouter.post("/signin", async function (c) {
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
        error: "No such account found!",
      });
    }
    const token = await sign({ userId: foundUser.id }, c.env?.JWT_SECRET);
    return c.json({ success: true, data: { token: `Bearer ${token}` } });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to signin!",
    });
  }
});
// Search User
userRouter.post("/search", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = userSearchInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Invalid input!" });
    }
    const queriedUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: body.query, mode: "insensitive" } },
          { name: { contains: body.query, mode: "insensitive" } },
        ],
      },
      skip: (body.currentPage - 1) * c.env?.pageContentLimitForUsers,
      take: c.env?.pageContentLimitForUsers,
      select: {
        id: true,
        username: true,
        name: true,
        profilePicURL: true,
        description: true,
        _count: {
          select: {
            followers: true,
            following: true,
            blogs: true,
          },
        },
      },
    });
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { username: { contains: body.query, mode: "insensitive" } },
          { name: { contains: body.query, mode: "insensitive" } },
        ],
      },
    });
    return c.json({
      success: true,
      data: {
        allUsers: queriedUsers,
        totalUsers,
      },
    });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the users!",
    });
  }
});
userRouter.get("userDetails/:userId", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = Number(c.req.param("userId"));
    const queriedUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        profilePicURL: true,
      },
    });
    return c.json({ success: true, data: queriedUser });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the users!",
    });
  }
});
// Get author details
userRouter.get("/details/:userId", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const authorId = Number(c.req.param("userId"));

    const authorDetails = await prisma.user.findFirst({
      where: {
        id: authorId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        profilePicURL: true,
        description: true,

        // Actions
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            blogImageURL: true,
            createdAt: true,
            comments: true,
            _count: {
              select: { likedByUsers: true },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
    if (!authorDetails) {
      c.status(400);
      return c.json({ success: false, error: "No such user found!" });
    }
    return c.json({ success: true, data: authorDetails });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to get user details!",
    });
  }
});

// 🟢 Auth Middleware 🟢
userRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(400);
    return c.json({ success: false, error: "You are Unauthorized!" });
  }
  try {
    const token = jwt.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(400);
      return c.json({ success: false, error: "You are Unauthorized!" });
    }
    c.set("jwtPayload", payload.userId);
    await next();
  } catch {
    c.status(401);
    return c.json({ success: false, error: "You are Unauthorized!" });
  }
});

// 🚹 User Related Routes 🚹
// Most followed Users
userRouter.get("/mostFollowed", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      take: 5,
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      select: {
        id: true,
        username: true,
        profilePicURL: true,
        _count: {
          select: { followers: true },
        },
      },
    });
    return c.json({ success: true, data: allUsers });
  } catch {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to fetch the users!",
    });
  }
});
// Get Self Details
userRouter.get("/details", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const userDetails = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        password: true,
        profilePicURL: true,
        description: true,
        createdAt: true,

        // Actions
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            blogImageURL: true,
            createdAt: true,
            comments: true,
            _count: {
              select: {
                likedByUsers: true,
                savedByUsers: true,
              },
            },
          },
        },
        likedBlogs: {
          select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            blogImageURL: true,
            createdAt: true,
            comments: true,
            _count: {
              select: {
                likedByUsers: true,
              },
            },
          },
        },
        savedBlogs: {
          select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            blogImageURL: true,
            createdAt: true,
            comments: true,
            _count: {
              select: {
                savedByUsers: true,
              },
            },
          },
        },
        comments: true,
        followers: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePicURL: true,
            description: true,
          },
        },
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePicURL: true,
            description: true,
          },
        },
        notifications: true,

        // Preferences
        favoriteTopics: true,
      },
    });
    return c.json({ success: true, data: userDetails });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to get your details!",
    });
  }
});
// Edit Description
userRouter.post("/description", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const body = await c.req.json();
    const { success } = userDescriptionInput.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }

    const userId = c.get("jwtPayload");

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        description: body.description,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to add description!",
    });
  }
});
// Edit Profile photo
userRouter.post("/photo", async function (c) {
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
    const userId = c.get("jwtPayload");
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
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
//Edit name, description
userRouter.put("/details/general", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = updateGeneralDetailsInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const userId = c.get("jwtPayload");
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to edit user details!",
    });
  }
});
userRouter.put("/details/password", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = updatePasswordDetailsInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const userId = c.get("jwtPayload");
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to edit user details!",
    });
  }
});
// Edit Favorite Topics
userRouter.post("/topics", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = profileTopics.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteTopics: {
          set: body.favoriteTopics.map((id: Number) => ({ id })),
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to set favourite topics!",
    });
  }
});
// Clear all notifications
userRouter.delete("/notifications", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        notifications: [],
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to clear notifications!",
    });
  }
});
// Update user details
userRouter.put("/details", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const { success } = updateUserDetailsInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const userId = c.get("jwtPayload");
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
        favoriteTopics: {
          set: body.favoriteTopics.map((id: Number) => ({ id })),
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    return c.json({
      success: false,
      error: "Something went wrong! Unable to edit user details!",
    });
  }
});
// Follow, Unfollow User
userRouter.post("/follow", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = userFollowInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          connect: { id: body.followId },
        },
      },
      select: {
        username: true,
      },
    });
    const newNotification = `${updatedUser.username} started following you!`;
    await prisma.user.update({
      where: {
        id: body.followId,
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
      error: "Something went wrong! Unable to follow!",
    });
  }
});
userRouter.post("/unfollow", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = userFollowInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        following: {
          disconnect: { id: body.followId },
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to unfollow!",
    });
  }
});

// 🗒️ Blog Related Routes 🗒️
// Read, Post, Edit, Delete Blog
userRouter.get("/blogs", async function (c) {
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
    const userId = c.get("jwtPayload");
    const allBlogs = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      skip: (body.currentPage - 1) * c.env?.pageContentLimitForBlogs,
      take: c.env?.pageContentLimitForBlogs,
    });
    return c.json({ success: true, data: allBlogs });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to get your blog!",
    });
  }
});
userRouter.post("/blog", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = blogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const { title, content, topics, imageURL } = body;
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: userId,
        blogImageURL: imageURL,
        topics: {
          connect: body.topics.map((id: Number) => ({ id })),
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to create blog!",
    });
  }
});
userRouter.put("/blog", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = blogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const { id, title, content, topics, imageURL } = body;
    await prisma.blog.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        content,
        blogImageURL: imageURL,
        topics: {
          set: body.topics.map((id: Number) => ({ id })),
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      e,
      error: "Something went wrong! Unable to edit the blog!",
    });
  }
});
userRouter.delete("/blog", async function (c) {
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
    const userId = c.get("jwtPayload");
    const blogToDelete = await prisma.blog.findFirst({
      where: {
        id: body.blogId,
        authorId: userId,
      },
    });
    if (!blogToDelete) {
      c.status(400);
      return c.json({ success: false, error: "You can't delete this blog!" });
    }
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
// Save/Unsave, Like/Unlike, Create/Edit/delete Comment Blog
userRouter.post("/blog/save", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedBlogs: {
          connect: { id: body.blogId },
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to save blog!",
    });
  }
});
userRouter.post("/blog/unsave", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        savedBlogs: {
          disconnect: { id: body.blogId },
        },
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to unsave blog!",
    });
  }
});
userRouter.post("/blog/like", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        likedBlogs: {
          connect: { id: body.blogId },
        },
      },
      select: {
        username: true,
      },
    });
    const likedBlog = await prisma.blog.findFirst({
      where: {
        id: body.blogId,
      },
      select: {
        authorId: true,
        title: true,
      },
    });
    if (likedBlog?.authorId !== userId) {
      const newNotification = `${updatedUser.username} liked your ${likedBlog?.title} blog!`;
      await prisma.user.update({
        where: {
          id: likedBlog?.authorId,
        },
        data: {
          notifications: {
            push: newNotification,
          },
        },
      });
    }
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to like blog!",
    });
  }
});
userRouter.post("/blog/unlike", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        likedBlogs: {
          disconnect: { id: body.blogId },
        },
      },
      select: {
        username: true,
      },
    });
    const likedBlog = await prisma.blog.findFirst({
      where: {
        id: body.blogId,
      },
      select: {
        authorId: true,
        title: true,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to unlike the blog!",
    });
  }
});
userRouter.post("/blog/comment", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = commentInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.comment.create({
      data: {
        blogId: body.blogId,
        authorId: userId,
        content: body.content,
      },
    });
    const commentedBlog = await prisma.blog.findFirst({
      where: {
        id: body.blogId,
      },
      select: {
        authorId: true,
        title: true,
      },
    });
    if (commentedBlog?.authorId !== userId) {
      const userWhoIsCommenting = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      });
      const newNotification = `${userWhoIsCommenting?.username} commented on your ${commentedBlog?.title} blog!`;
      await prisma.user.update({
        where: {
          id: commentedBlog?.authorId,
        },
        data: {
          notifications: {
            push: newNotification,
          },
        },
      });
    }

    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to comment on blog!",
    });
  }
});
userRouter.put("/blog/comment", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("jwtPayload");
    const body = await c.req.json();
    const { success } = commentEditInput.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ success: false, error: "Your Inputs are not valid!" });
    }
    await prisma.comment.update({
      where: {
        id: body.commentId,
        authorId: userId,
      },
      data: {
        content: body.content,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to edit the comment!",
    });
  }
});
userRouter.delete("/blog/comment/:commentId", async function (c) {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const commentId = Number(c.req.param("commentId"));
    const userId = c.get("jwtPayload");
    await prisma.comment.delete({
      where: {
        id: commentId,
        authorId: userId,
      },
    });
    return c.json({ success: true });
  } catch (e) {
    c.status(400);
    return c.json({
      success: false,
      error: "Something went wrong! Unable to delete the comment!",
    });
  }
});

export default userRouter;
