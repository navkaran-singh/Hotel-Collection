import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

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

// Bookings page
router.get("/bookings", (req, res) => {
  res.render("bookings");
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
// Removed /dashboard route to prevent infinite redirect loop

// Removed /logout route to prevent infinite redirect loop

export default router;
