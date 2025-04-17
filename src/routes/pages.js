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
  res.render("index")
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup")
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact")
});

router.get("/portfolio", (req, res) => {
  res.render("portfolio")
});

router.get("/luxury", (req, res) => {
  res.render("luxury")
});

// Protected routes
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.redirect("dashboard")
});

router.get("/logout", isAuthenticated, (req, res) => {
  res.redirect("logout");
});

export default router;
