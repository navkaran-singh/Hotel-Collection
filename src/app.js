import express from "express";
import cors from "cors";
import morgan from "morgan";
import path, { join } from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import pageRoutes from "./routes/pages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(join(__dirname, "../views")));

// Routes
app.use("/", pageRoutes);
app.use("/auth", authRoutes);

// Dashboard route
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: "User" });
});

// Application-level logging middleware
app.use((req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
