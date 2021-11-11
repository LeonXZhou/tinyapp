// Server constants
const PORT = 8080; // default port 8080
const urlDatabase = {
  // psuedo Database;
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// required library import
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const generateUniqueStringWrapper = require("./uniqueRandomStringHelper")
const generateUniqueRandomString = generateUniqueStringWrapper(urlDatabase);

// Express Server Declaration
const app = express();

// Middleware set-up
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// GET method handlers
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls", (req, res) => {
  const templateVars = { urlDatabase, username: req.cookies["username"], };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"], };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

// POST method handlers
app.post("/urls", (req, res) => {
  const shortUrl = generateUniqueRandomString()
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  res.cookie('username',req.body.username)
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Express Server Listening on ${PORT}!`);
});
