import { Hono } from "hono";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import topicRouter from "./routes/topicRouter";
import blogRouter from "./routes/blogRouter";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

app.route("/user", userRouter);
app.route("/admin", adminRouter);
app.route("/topic", topicRouter);
app.route("/blog", blogRouter);

export default app;
