// Server constants
const PORT = 8080; // default port 8080
const urlDatabase = {
  // psuedo Database;
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

// required library import
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const generateUniqueStringWrapper = require("./uniqueRandomStringHelper");
const userHelperFunctionWrapper = require("./userHelperFunctions");
const generateUniqueUrl = generateUniqueStringWrapper(urlDatabase);
const generateUniqueUserID = generateUniqueStringWrapper(users);
const checkEmailUniqueness = userHelperFunctionWrapper(users);

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
  const templateVars = { urlDatabase, user: users[req.cookies["user_id"]], };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]], };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]], };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]], };
  res.render("login", templateVars);
});



// POST method handlers
app.post("/urls", (req, res) => {
  const shortUrl = generateUniqueUrl()
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
  res.cookie('username', req.body.username)
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  const UID = generateUniqueUserID();
  if (checkEmailUniqueness(req.body.email)) {
    users[UID] = {
      id: UID,
      email: req.body.email,
      password: req.body.password,
    }
    res.cookie('user_id', UID);
    res.redirect(`/urls`);
  }
  else{
    res.status(400).send('Error: the email you entered is already in use')
  }
});

app.listen(PORT, () => {
  console.log(`Express Server Listening on ${PORT}!`);
});
