const express  = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

// No users should see this list unless the userID matches
const urlDatabase = {
  "b2xVn2": {longURL: "www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK":  {longURL: "www.google.com", userID: "aJ48lW"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "1234"
  }
};

const checkUser = function(email, userData, key) {
  for (let userId in userData) {
    if (email === userData[userId][key]) {
      return false;
    }
  }
  return true;
};

const checkUserId = function(email, userData)  {
  for (let id in userData) {
    if (email === userData[id].email) {
      return id;
    }
  }
};

// Random string generator
const generateRandomString = () => {
  const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(string[Math.floor(Math.random() * 62)]);
  }
  return arr.join("");
};

// Route to the home page
app.get("/", (req, res) => {
  const templateVars = { user: req.cookies["user_id"] };
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.send("Hello!");
});

// Route to My URLs page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user_id"], users};
  res.render("urls_index", templateVars);
});

// Route to the forms page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users};
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

// route to the registration page
app.get("/registration", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users};
  res.render("urls_registration", templateVars);
});

// route to the login page
app.get("/login", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users};
  res.render("login" ,templateVars);
});

// Route to the render information of a single URL in short URL form (key id)
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { url: urlDatabase, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: req.cookies["user_id"], users};
  console.log(templateVars.longURL, urlDatabase);
  res.render("urls_show", templateVars);
});

// Access the website of the long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`http://${longURL}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Hello page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Error page when registering a email that is already in user database
// app.get("*", (req, res) => {
//   res.status(400).send("<h1>400</h1>");
// });

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Deletes the links and redirect to /urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = urlDatabase[req.params.shortURL];
  // Conditions: if only the owner (creator) of the URL can delete the link
  if (!req.cookies("user_id")) {
    res.status(403).send("You are not logged in");
  } else if (req.cookies["user_id"] !== user.userID) {
    res.status(403).send("Can't delete this url, it does not belong to you!");
  } else if (!user) {
    res.status(403).send("id does not exist");
  }
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// Updates the long URL edited by the client
app.post("/urls/:id", (req, res) => {
  const templateVars = req.body;
  urlDatabase[req.params.id] = {longURL: templateVars.longURL, userID: req.cookies["user_id"]};
  res.redirect(`/urls/${req.params.id}`);
});

// Endpoint to handle the registration form data
app.post("/registration", (req, res) => {
  const templateVars = req.body;
  const userId = generateRandomString();
  const userEmail = templateVars.email;
  const userPassword = templateVars.password;
  const user = {id: userId, email: userEmail, password: userPassword};
  if (userEmail === "" || userPassword === "") {
    res.status(400).send("<h1>400</h1><h2>Please enter username or password</h2>");
  } else if (!checkUser(userEmail, users, "email")) {
    res.status(400).send("<h1>400</h1><h2>Email already registered</h2>");
  } else {
    users[userId] = user;
    console.log(users);
    res.cookie('user_id', userId);
    res.redirect("/urls");
  }
});

// Endpoint to handle a POST to /login
// Stores the client's username in the cookie
app.post("/login", (req, res) => {
  console.log(req.body);
  const templateVars = req.body;
  const email = templateVars.email;
  const password = templateVars.password;
  if (email === "" || password === "") {
    res.status(400).send("<h1>400</h1><h2>Please enter username or password</h2>");
  } else if (!checkUser(email, users, "email") && checkUser(password, users, "password")) {
    res.status(403).send("<h1>403</h1><h2>Password incorrect</h2>");
  } else if (checkUser(email, users, "email")) {
    res.status(403).send("<h1>403</h1><h2>Email not found</h2>");
  }
  const userId = checkUserId(email, users);
  res.cookie('user_id', userId);
  res.redirect(`/urls`);
});

// Endpoint to handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});