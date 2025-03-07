import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Public routes
router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../../public/index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(join(__dirname, "../../public/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(join(__dirname, "../../public/signup.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(join(__dirname, "../../public/about.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(join(__dirname, "../../public/contact.html"));
});

router.get("/portfolio", (req, res) => {
  res.sendFile(join(__dirname, "../../public/portfolio.html"));
});

router.get("/luxury", (req, res) => {
  res.sendFile(join(__dirname, "../../public/luxury.html"));
});

// Protected routes
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(join(__dirname, "../../public/dashboard.html"));
});

router.get("/logout", isAuthenticated, (req, res) => {
  res.sendFile(join(__dirname, "../../public/logout.html"));
});

export default router;
