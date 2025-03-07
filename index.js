import http from "http";
import fs from "fs";
import querystring from "querystring"; // parsing URL encoded data

const PORT = 3000;

const serveStaticFile = (req, res, filePath, contentType) => {
  try {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  } catch (error) {
    res.end(error.message);
  }
};

const handleLogin = (req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      // handling post request
      body += chunk.toString();
    });

    req.on("end", () => {
      const { username, password } = querystring.parse(body); // cuz it's URL encoded
      fs.readFile("users.json", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error during reading data from users.json");
          return;
        }
        let users = JSON.parse(data);
        console.log("Users are", users);
        for (let key in users) {
          if (key == username) {
            console.log(key, users[key]);
            if (users[key] == password) {
              res.writeHead(302, { Location: "/dashboard" });
              //   window.location.href = "/dashboard";  NOT WORKING BECAUSE WINDOW OBJECT ONLY AVAILABLE IN BROWSER ENV
              return res.end();
            } else {
              res.writeHead(500, { "Content-Type": "text/plain" });
              return res.end("Invalid Password");
            }
          }
        }
        res.writeHead(302, { Location: "/signup" }); // Redirect
        res.end();
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const handleSignup = (req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    let data = fs.readFileSync("users.json", "utf8");

    req.on("end", () => {
      const parsedData = querystring.parse(body);

      const username = parsedData.username;
      const password = parsedData.password;
      const confirmPassword = parsedData["confirm-password"];

      if (password != confirmPassword) {
        res.statusCode = 400;
        return res.end("Passwords Don't Match");
      } else {
        res.statusCode = 200;
        data = JSON.parse(data);
        data[username] = password;
        fs.writeFileSync("users.json", JSON.stringify(data), "utf8");
        return res.end(`Sign up successful! Username: ${username}`);
      }
    });
  } catch (error) {
    res.end("Something went wrong");
  }
};

const handleLogOut = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const { username, password } = querystring.parse(body);
    fs.readFile("users.json", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error during reading data from users.json");
        return;
      }
      let users = JSON.parse(data);
      if (users[username]) {
        if (users[username] === password) delete users[username];
        else return res.end("Incorrect Password");

        fs.writeFile("users.json", JSON.stringify(users), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Error writing to users.json");
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          return res.end("User has been logged out successfully");
        });
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        return res.end("User Doesn't Exist");
      }
    });
  });
};

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    console.log("Base page");
    serveStaticFile(req, res, "./public/index.html", "text/html");
  } else if (req.url === "/login") {
    console.log("Login Page");
    if (req.method === "GET")
      serveStaticFile(req, res, "./public/login.html", "text/html");
    else if (req.method === "POST") handleLogin(req, res);
  } else if (req.url === "/dashboard" && req.method === "GET") {
    console.log("Dashboard Page");
    serveStaticFile(req, res, "./public/dashboard.html", "text/html");
  } else if (req.url === "/signup") {
    console.log("Sign Up Page");
    if (req.method === "POST") handleSignup(req, res);
    else if (req.method === "GET") {
      serveStaticFile(req, res, "./public/signup.html", "text/html");
    }
  } else if (req.url === "/logout" && req.method === "GET") {
    console.log("Logout Page");
    serveStaticFile(req, res, "./public/logout.html", "text/html");
  } else if (req.url === "/logout" && req.method === "POST") {
    console.log("Logout Page");
    handleLogOut(req, res);
  } else if (req.url === "/contact" && req.method === "GET") {
    serveStaticFile(req, res, "./public/contact.html", "text/html");
  } else if (req.url === "/luxury" && req.method === "GET") {
    serveStaticFile(req, res, "./public/luxury.html", "text/html");
  } else if (req.url === "/portfolio" && req.method === "GET") {
    serveStaticFile(req, res, "./public/portfolio.html", "text/html");
  } else if (req.url === "/index" && req.method === "GET") {
    serveStaticFile(req, res, "./public/index.html", "text/html");
  } else if (req.url === "/about" && req.method === "GET") {
    serveStaticFile(req, res, "./public/about.html", "text/html");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} : http://localhost:${3000}`);
});
