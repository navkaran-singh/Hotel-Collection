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

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readUsers();

    if (users[username] && users[username] === password) {
      req.session.user = username;
      res.redirect("/dashboard");
    } else {
      res.redirect("/login?error=invalid");
    }
  } catch (error) {
    res.redirect("/login?error=server");
  }
});

// Signup route
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

    req.session.user = username;
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Logout route
router.post("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error logging out");
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default router;
