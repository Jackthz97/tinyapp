const express  = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Route to the home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Route to My URLs page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Route to the forms page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Route to the render information of a single URL in short URL form (key id)
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(`http://${longURL}`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

const generateRandomString = () => {
  const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(string[Math.floor(Math.random() * 62)]);
  }
  return arr.join("");
};