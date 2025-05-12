import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { username, password, "confirm-password": confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).send("Passwords don't match");

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).send("Username already exists");

    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      res.redirect("/dashboard");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.redirect("/");
});

export default router;
