import { Hono } from "hono";
import userRouter from "./routes/userRouter";

const app = new Hono();

app.route("/user", userRouter);

export default app;
