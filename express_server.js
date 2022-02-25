// All the middlewares used
const express  = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['my', 'secret', 'keys']
}));
console.log();
//-------------------------------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

// No users should see this list unless the userID matches
const urlDatabase = {
  "b2xVn2": {longURL: "www.lighthouselabs.ca", userID: "userRandomID"},
  "9sm5xK":  {longURL: "www.google.com", userID: "user2RandomID"}
};

// Some hashed passwords for the 2 default example users
const exHashedPassword1 = bcrypt.hashSync("123", 10);
const exHashedPassword2 = bcrypt.hashSync("1234", 10);
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: exHashedPassword1 //123
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: exHashedPassword2 //1234
  }
};

//-------------------------------------------------------------------------------------------------------
// Helper functions

const checkEmail = function(email, userData) {
  for (let userId in userData) {
    if (email === userData[userId].email) {
      return true;
    }
  }
  return false;
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

//-------------------------------------------------------------------------------------------------------

// Route to the home page
app.get("/", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { user: userId };
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.send("Hello!");
});

//-------------------------------------------------------------------------------------------------------

// Route to My URLs page
app.get("/urls", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { urls: urlDatabase, user: userId, users};
  res.render("urls_index", templateVars);
});

// POST endpoint to create new urls
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  const userId = req.session.userID;
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: userId};
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//-------------------------------------------------------------------------------------------------------

// Renders urls_new template
app.get("/urls/new", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { user: userId, users};
  if (!templateVars.user) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

//-------------------------------------------------------------------------------------------------------

// Renders to the registration page
app.get("/registration", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { user: userId, users};
  res.render("urls_registration", templateVars);
});

// Endpoint to handle the registration form data
app.post("/registration", (req, res) => {
  const templateVars = req.body;
  const userId = generateRandomString();
  const userEmail = templateVars.email;
  const userPassword = templateVars.password;
  const userHashedPassword = bcrypt.hashSync(userPassword, 10);
  const user = {id: userId, email: userEmail, password: userHashedPassword};
  if (userEmail === "" || userPassword === "") {
    res.status(400).send("<h1>400</h1><h2>Please enter username or password</h2>");
  } else if (checkEmail(userEmail, users)) {
    res.status(400).send("<h1>400</h1><h2>Email already registered</h2>");
  } else {
    users[userId] = user;
    // console.log(users);
    req.session.userID = userId;
    res.redirect("/urls");
  }
});

//-------------------------------------------------------------------------------------------------------

// Renders login page
app.get("/login", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { user: userId, users};
  res.render("login" ,templateVars);
});

// Endpoint to handle user logins
// Stores the user info in the cookie
app.post("/login", (req, res) => {
  const templateVars = req.body;
  const email = templateVars.email;
  const password = templateVars.password;
  const userKey = checkUserId(email, users);
  if (email === "" || password === "") {
    return res.status(400).send("<h1>400</h1><h2>Please enter username or password</h2>");
  } else if (checkEmail(email, users) && !bcrypt.compareSync(password, users[userKey].password)) {
    return res.status(403).send("<h1>403</h1><h2>Password incorrect</h2>");
  } else if (!checkEmail(email, users)) {
    return res.status(403).send("<h1>403</h1><h2>Email not found</h2>");
  }
  const userId = checkUserId(email, users);
  req.session.userID = userId;
  res.redirect(`/urls`);
});

//-------------------------------------------------------------------------------------------------------

// Renders urls_new template
app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.userID;
  const templateVars = { url: urlDatabase, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: userId, users};
  // console.log(templateVars.longURL, urlDatabase);
  res.render("urls_show", templateVars);
});

// Access the website of the long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(`http://${longURL}`);
});

//-------------------------------------------------------------------------------------------------------

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Hello page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//-------------------------------------------------------------------------------------------------------

// Deletes the links and redirect to /urls page
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// Updates the long URL edited by the client
app.post("/urls/:id", (req, res) => {
  const templateVars = req.body;
  const userId = req.session.userID;
  urlDatabase[req.params.id] = {longURL: templateVars.longURL, userID: userId};
  res.redirect(`/urls/${req.params.id}`);
});

//-------------------------------------------------------------------------------------------------------

// Endpoint to handle logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//-------------------------------------------------------------------------------------------------------