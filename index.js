import express from "express";
import fs from "fs";
import bodyParser from "body-parser"; // for handling POST requests
import path from "path"; // for static files

const app = express();
const PORT = 3000;

// Set up bodyParser for handling POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Home route (renders the index page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Login route (GET for the form, POST for handling login)
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile("users.json", (err, data) => {
    if (err) return res.status(500).send("Error reading users file");

    const users = JSON.parse(data);

    // Check if the username exists and the password matches
    if (users[username] && users[username] === password) {
      // After successful login, render the dashboard directly
      return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
    } else if (users[username]) {
      // If username exists but the password is wrong
      return res.status(401).send("Invalid Password");
    } else {
      // If the username doesn't exist, redirect to signup
      return res.redirect("/signup");
    }
  });
});

// Signup route (GET for the form, POST for handling signup)
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/signup", (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords don't match");
  }

  fs.readFile("users.json", (err, data) => {
    if (err) return res.status(500).send("Error reading users file");

    let users = JSON.parse(data);
    users[username] = password;

    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      if (err) return res.status(500).send("Error writing to users file");
      res.send(`Sign up successful! Username: ${username}`);
    });
  });
});

// Dashboard route (GET for the page)
app.get("/dashboard", (req, res) => {
  // Check for a logged-in user by username query or redirect
  // const username = req.query.username;

  // if (!username) {
  //   // Redirect if no username in query (assuming the user should be logged in)
  //   return res.redirect("/login");
  // }

  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Logout route (GET for the page)
app.get("/logout", (req, res) => {
  res.send("User logged out");
});

// Serve other static pages
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/luxury", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "luxury.html"));
});

app.get("/portfolio", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "portfolio.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

// Catch-all route for unknown paths
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
