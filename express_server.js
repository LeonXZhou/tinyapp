// Server constants
const PORT = 8080; // default port 8080
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  aJ48lq: {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// required npm library import
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session')

// local js import (helper functions)
const generateUniqueStringWrapper = require("./URLHelperFunctions");
const userHelperFunctionWrapper = require("./userHelperFunctions");

//destructuring functions with correct "databse enclosed"
const [generateUniqueUrl, urlsForUser] = generateUniqueStringWrapper(urlDatabase);
const [generateUniqueUserID,] = generateUniqueStringWrapper(users);
const { checkEmailUniqueness, authenticateUser, getUID } = userHelperFunctionWrapper(users);

// Express Server Declaration
const app = express();

// Middleware set-up
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['pi314','e278'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// GET method handlers
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls", (req, res) => {
  const filteredURL = urlsForUser(req.cookies.use_id)
  const templateVars = { urlDatabase: filteredURL, user: users[req.cookies.use_id], };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies.use_id], };
  if (req.cookies.use_id) {
    res.render("urls_new", templateVars);
  }
  else {
    res.render("login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    if (urlDatabase[req.params.shortURL].userID === req.cookies.use_id) {
      const templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longUrl,
        user: users[req.cookies.use_id],
      };
      res.render("urls_show", templateVars);
    } else {
      res.status(400).send('Error 400: you do not have access to this url')
    }
  }
  else { res.status(404).send('Error 404: short url not found') }

});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL)
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies.use_id], };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies.use_id], };
  res.render("login", templateVars);
});



// POST method handlers
app.post("/urls", (req, res) => {
  const shortUrl = generateUniqueUrl()
  if (req.cookies.use_id) {
    urlDatabase[shortUrl] = { longURL: req.body.longURL, userID: req.cookies.use_id };
    res.redirect(`/urls/${shortUrl}`);
  }
  else {
    return res.status(400).send('Error 400: you must login/register first to shorten emails')
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    if (urlDatabase[req.params.shortURL].userID === req.cookies.use_id) {
      delete urlDatabase[req.params.shortURL];
      res.redirect(`/urls`);
    } else {
      res.status(400).send('Error 400: you do not have access to this url')
    }
  }
  else { res.status(404).send('Error 404: short url not found') }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    if (urlDatabase[req.params.shortURL].userID === req.cookies.use_id) {
      urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
      res.redirect(`/urls`);
    } else {
      res.status(400).send('Error 400: you do not have access to this url')
    }
  }
  else { res.status(404).send('Error 404: short url not found') }
});

app.post("/logout", (req, res) => {
  req.session = null
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (checkEmailUniqueness(req.body.email)) {
    bcrypt.genSalt(10)
      .then((salt) => { return bcrypt.hash("req.body.password", salt) })
      .then((hashedPassword) => {
        const UID = generateUniqueUserID()
        users[UID] = {
          id: UID,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10), //stores hashed password
        }
        req.session.user_id = UID;
        res.redirect(`/urls`);
      })
      .catch((err) => { console.log(err) });
  }
  else {
    return res.status(400).send('Error 400: the email you entered is already in use')
  }
});

app.post("/login", (req, res) => {
  if(!checkEmailUniqueness(req.body.email)){
  const serverHashPassword = users[getUID(req.body.email)].password
  bcrypt.compare(req.body.password, serverHashPassword)
    .then((value) => {
      if (value) {
        req.session.user_id = getUID(req.body.email);
        res.redirect(`/urls`);
      }
      else {
        res.status(403).send('Error 403: Login Information Inccorect')
      }
    })
    .catch((err) => { console.log(err) })
  }
  else {
    res.status(403).send('Error 403: No one here with that email! learn to type')
  }
});


app.listen(PORT, () => {
  console.log(`Express Server Listening on ${PORT}!`);
});
