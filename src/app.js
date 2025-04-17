import express from "express";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";
import querystring from "querystring";
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

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
// Serve static files
app.use(express.static(join(__dirname, "../views")));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Routes
app.use("/", pageRoutes);
app.use("/auth", authRoutes);


app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

app.get("/index", (req, res) => {
  res.render("index");
});

// Handle login
app.post("/login", (req, res) => {
  let { username, password } = req.body;
  fs.readFile("users.json", (err, data) => {
    if (err) return res.status(500).send("Error reading user data");
    let users = JSON.parse(data);
    if (users[username] && users[username] === password) {
      req.session.user = username;
      return res.redirect("/dashboard");
    }
    res.status(401).send("Invalid credentials");
  });
});

// Handle signup
app.post("/signup", (req, res) => {
  let { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords don't match");
  }
  fs.readFile("users.json", "utf8", (err, data) => {
    let users = data ? JSON.parse(data) : {};
    users[username] = password;
    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      if (err) return res.status(500).send("Error saving user");
      res.send("Signup successful!");
    });
  });
});

// Handle logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out");
    res.send("Logged out successfully");
  });
});

// Application-level middleware example
app.use((req, res, next) => {
  console.log("Request received at:", new Date().toISOString());
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
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
