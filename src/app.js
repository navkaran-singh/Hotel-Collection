import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import pageRoutes from "./routes/pages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware example
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
// Serve static files
app.use(express.static(join(__dirname, "../views")));

// Routes
app.use("/", pageRoutes);
app.use("/auth", authRoutes);

// Dashboard route - no session check
app.get("/dashboard", (req, res) => {
  // Simply render the dashboard without user data
  res.render("dashboard", { user: "User" });
});

app.get("/index", (req, res) => {
  res.render("index");
});

// Handle login - without sessions
app.post("/login", (req, res) => {
  let { username, password } = req.body;
  const usersFilePath = path.join(__dirname, "users.json");
  
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading user data:", err);
      return res.status(500).send("Error reading user data");
    }
    
    try {
      let users = JSON.parse(data);
      if (users[username] && users[username] === password) {
        // Simply redirect to dashboard on successful login
        return res.redirect("/dashboard");
      } else {
        res.status(401).send("Invalid credentials");
      }
    } catch (error) {
      console.error("Error processing user data:", error);
      res.status(500).send("Error processing user data");
    }
  });
});

// Handle signup
app.post("/signup", (req, res) => {
  let { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords don't match");
  }
  
  const usersFilePath = path.join(__dirname, "users.json");
  
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    let users = {};
    if (!err && data) {
      try {
        users = JSON.parse(data);
      } catch (error) {
        return res.status(500).send("Error parsing user data");
      }
    }
    
    users[username] = password;
    
    fs.writeFile(usersFilePath, JSON.stringify(users), (writeErr) => {
      if (writeErr) return res.status(500).send("Error saving user");
      res.send("Signup successful!");
    });
  });
});

// Application-level middleware example
app.use((req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  next();
});

// Error handling middleware
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