import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.js";
import connectDB from "./config/db.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
const app = express();
dotenv.config();

//middlewares
app.use(cors());
app.use(express.json());

//connect to database
connectDB();

//routes
app.use('/api/todos', todoRoutes);

//error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});     