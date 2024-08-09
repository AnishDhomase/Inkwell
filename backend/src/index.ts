import { Hono } from "hono";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import topicRouter from "./routes/topicRouter";

const app = new Hono();

app.route("/user", userRouter);
app.route("/admin", adminRouter);
app.route("/topic", topicRouter);

export default app;
