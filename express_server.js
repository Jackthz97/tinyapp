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

const urlDatabase = {
  "b2xVn2": "www.lighthouselabs.ca",
  "9sm5xK": "www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const checkEmail = function(email, userData) {
  for (let userId in userData) {
    if (email === userData[userId].email) {
      return false;
    }
  }
  return email;
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
  res.send("Hello!");
});

// Route to My URLs page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user_id"], users, checker: false };
  res.render("urls_index", templateVars);
});

// Route to the forms page
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users, checker: false };
  res.render("urls_new", templateVars);
});

app.get("/registration", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users, checker: false};
  res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: req.cookies["user_id"], users, checker: true};
  res.render("login" ,templateVars);
});

// Route to the render information of a single URL in short URL form (key id)
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies["user_id"], users};
  console.log(templateVars.longURL);
  res.render("urls_show", templateVars);
});

// Access the website of the long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
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
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Deletes the links and redirect to /urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// Updates the long URL edited by the client
app.post("/urls/:id", (req, res) => {
  const templateVars = req.body;
  urlDatabase[req.params.id] = templateVars.longURL;
  res.redirect(`/urls/${req.params.id}`);
});

// Endpoint to handle the registration form data
app.post("/registration", (req, res) => {
  const templateVars = req.body;
  const userID = generateRandomString();
  const userEmail = templateVars.email;
  const userPassword = templateVars.password;
  const user = {id: userID, email: userEmail, password: userPassword};
  if (userEmail === "" || userPassword === "") {
    res.status(400).send("<h1>400</h1><h2>Please enter username or password</h2>");
  } else if (!checkEmail(userEmail, users)) {
    res.status(400).send("<h1>400</h1><h2>Email already registered</h2>");
  } else {
    users[userID] = user;
    console.log(users);
    res.cookie('user_id', userID);
    res.redirect("/urls");
  }
});

// Endpoint to handle a POST to /login
// Stores the client's username in the cookie
app.post("/login", (req, res) => {

  res.redirect(`/urls`);
});

// Endpoint to handle logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});