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
const generateUniqueStringWrapper = require("./uniqueRandomStringHelper")
const generateUniqueRandomString = generateUniqueStringWrapper(urlDatabase);

// Express Server Declaration
const app = express();

// Middleware set-up
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


// GET method handlers
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});


// POST method handlers
app.post("/urls", (req, res) => {
  const randomString = generateUniqueRandomString()
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`)
});


app.listen(PORT, () => {
  console.log(`Express Server Listening on ${PORT}!`);
});
