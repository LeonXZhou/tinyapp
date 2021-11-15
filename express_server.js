// Server constants
const PORT = 8080; // default port 8080
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
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
    password: 'asdf'
  },
  aJ48lq: {
    id: "aJ48lq",
    email: "user2@example.com",
    password: 'asdf'
  }
};


// required npm library import
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

// local js import (helper functions)
const generateUniqueStringWrapper = require("./URLHelperFunctions");
const userHelperFunctionWrapper = require("./userHelperFunctions");

//destructuring functions with correct "databse enclosed"
const [generateUniqueUrl, urlsForUser] = generateUniqueStringWrapper(urlDatabase);
const [generateUniqueUserID,] = generateUniqueStringWrapper(users);
const { checkEmailUniqueness, getUID } = userHelperFunctionWrapper(users);

// Express Server Declaration
const app = express();

// Middleware set-up
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['pi314', 'e278'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// update existing user passwords to be hashed
users.aJ48lW.password = bcrypt.hashSync("a", 10);
users.aJ48lq.password = bcrypt.hashSync("a", 10);


// GET method handlers

app.get("/", (req, res) => {
  const user = users[req.session.user_id];

  if (!user) {
    return res.redirect('login');
  }

  return res.redirect('urls');
});


app.get("/urls", (req, res) => {
  const filteredURLs = urlsForUser(req.session.user_id);
  const user = users[req.session.user_id]
  const templateVars = { urlDatabase: filteredURLs, user, };
  return res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  if (!user) {
    return res.redirect("/login");
  }

  return res.render("urls_new", templateVars);

});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  if (!id) {
    return res.status(400).send("Error 400: you are not logged in")
  }

  const user = users[req.session.user_id];
  if (!user) {
    return res.status(400).send("Error 400: invalid user or stale cookie")
  }

  const shortURL = req.params.shortURL;
  const urlRecord = urlDatabase[shortURL];
  if (!urlRecord) {
    return res.status(404).send("Error 404: short URL not found")
  }

  if (urlRecord.userID !== id) {
    return res.status(400).send('Error 400: you do not have access to this url either because you');
  }

  const longURL = urlRecord.longURL;
  const templateVars = { shortURL, longURL, user };
  return res.render("urls_show", templateVars);

});

app.get("/u/:shortURL", (req, res) => {
  const urlRecord = urlDatabase[req.params.shortURL];
  if (!urlRecord) {
    return res.status(404).send('Error 404: short url not found');
  }

  return res.redirect(urlRecord.longURL);

});

app.get("/register", (req, res) => {
  const user = users[req.session.user_id]
  const templateVars = { user };
  if (!user) {
    return res.render("register", templateVars);
  }

  return res.redirect("/urls")

});

app.get("/login", (req, res) => {
  const user = users[req.session.user_id]
  const templateVars = { user };

  if (!user) {
    return res.render("login", templateVars);
  }

  return res.redirect("/urls")

});



// POST method handlers
app.post("/urls", (req, res) => {
  const shortUrl = generateUniqueUrl();
  const user = users[req.session.user_id]
  if (!user) {
    return res.status(400).send('Error 400: you must login/register first to shorten emails');
  }

  urlDatabase[shortUrl] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id
  if (!id) {
    return res.status(400).send('Error 400: you are not logged in')
  }

  const user = users[id];
  if (!user) {
    return res.status(400).send("Error 400: invalid user or stale cookie")
  }

  const urlRecord = urlDatabase[req.params.shortURL]
  if (!urlRecord) {
    return res.status(404).send('Error 404: short url not found');
  }

  if (urlRecord.userID !== id) {
    return res.status(400).send('Error 400: you do not have access to this url');
  }

  delete urlDatabase[req.params.shortURL];
  return res.redirect(`/urls`);

});

app.post("/urls/:shortURL/edit", (req, res) => {
  const id = req.session.user_id;

  if (!id) {
    return res.status(400).send('Error 400: you are not logged in')
  }

  const user = users[id];
  if (!user) {
    return res.status(400).send("Error 400: invalid user or stale cookie")
  }

  const urlRecord = urlDatabase[req.params.shortURL]
  if (!urlRecord) {
    return res.status(404).send('Error 404: short url not found');
  }

  if (urlRecord.userID !== id) {
    return res.status(400).send('Error 400: you do not have access to this url');
  }

  urlRecord.longURL = req.body.newLongURL;
  res.redirect(`/urls`);

});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  const email = req.body.email;

  if (!checkEmailUniqueness(email)) {
    return res.status(400).send('Error 400: the email you entered is already in use');
  }

  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Error 400: password or email cannot be blank');
  }

  const id = req.session.user_id;
  const user = users[id]
  if (id && user) {
    return res.redirect("/urls")
  }

  bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(req.body.password, salt);
    })
    .then((hashedPassword) => {
      const UID = generateUniqueUserID();
      users[UID] = {
        id: UID,
        email: req.body.email,
        password: hashedPassword, //stores hashed password
      };
      req.session.user_id = UID;
      res.redirect(`/urls`);
    })
    .catch((err) => {
      console.log(err);
    });

});

app.post("/login", (req, res) => {
  const email = req.body.email;

  if (checkEmailUniqueness(email)) {
    return res.status(403).send('Error 403: No one here with that email! learn to type');
  }
  
  const serverHashPassword = users[getUID(req.body.email)].password;
  bcrypt.compare(req.body.password, serverHashPassword)
    .then((value) => {
      if (!value) {
        res.status(403).send('Error 403: Login Information Inccorect');
      } 
      req.session.user_id = getUID(req.body.email);
      return res.redirect(`/urls`);
    })
    .catch((err) => {
      console.log(err);
    });
});


app.listen(PORT, () => {
  console.log(`Express Server Listening on ${PORT}!`);
});

