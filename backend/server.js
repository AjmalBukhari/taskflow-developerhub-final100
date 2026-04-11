import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Routes
app.use("/api/tasks", taskRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});


import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

app.use(notFound);
app.use(errorHandler);