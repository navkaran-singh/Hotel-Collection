import express from "express";
import { promises as fs } from "fs";
import { join } from "path";

const router = express.Router();
const usersFile = join(process.cwd(), "users.json");

// Middleware to read users file
const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// Middleware to write users file
const writeUsers = async (users) => {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
};

// Login route - without sessions
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();

    if (users[username] && users[username] === password) {
      // Simply redirect to dashboard without session
      res.redirect("/dashboard");
    } else {
      res.redirect("/login?error=invalid");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.redirect("/login?error=server");
  }
});

// Signup route - without sessions
router.post("/signup", async (req, res) => {
  try {
    const {
      username,
      password,
      "confirm-password": confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords don't match");
    }

    const users = await readUsers();

    if (users[username]) {
      return res.status(400).send("Username already exists");
    }

    users[username] = password;
    await writeUsers(users);

    // Redirect to dashboard without session
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error");
  }
});

// Logout route - simplified without sessions
router.post("/logout", async (req, res) => {
  // Just redirect to home page
  res.redirect("/");
});

export default router;