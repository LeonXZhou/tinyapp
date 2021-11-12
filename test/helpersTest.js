const assert = require('chai').assert;
const testUsers = {
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

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  b6UTxq: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "010101"
  }
};

const userHelperFunctionWrapper = require('../userHelperFunctions');
const generateUniqueStringWrapper = require("../URLHelperFunctions");

const {checkEmailUniqueness, getUID } = userHelperFunctionWrapper(testUsers);
const [generateUniqueUrl, urlsForUser] = generateUniqueStringWrapper(urlDatabase);

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUID("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user, expectedUserID);
  });
  it('should return a undefined with and invalid email', function() {
    const user = getUID("wrong@ple.com", testUsers)
    const expectedUserID = undefined;
    assert.strictEqual(user, expectedUserID);
  });
});


describe('checkEmailUniqueness', function() {
  it('should return true if the supplied email does not exist in database', function() {
    assert.strictEqual(true, checkEmailUniqueness("wrong@ple.com", testUsers));
  });
  it('should return false if the supplied email doesn exist in database', function() {
    assert.strictEqual(false, checkEmailUniqueness("user@example.com", testUsers));
  });
});

describe('urlsForUser', function() {
  it('given a userid, urlsForUser should return an object with url objects belonging to that user.', function() {
    const filtered = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
      },
      b6UTxq: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW"
      }
    };
    assert.deepEqual(filtered, urlsForUser('aJ48lW'));
  });

});

//Not sure if the one below works... I'll leave it running overnight

// describe('generateUniqueUrl', function() {
//   it('should fill up urlDatabse until it has 56800235586 unique string ids. then return false', function() {
//     while (true)
//     {
//       const randomURL = generateUniqueUrl()
//       if (randomURL === false)
//       {
//         break;
//       }
//       console.log(Object.keys(urlDatabase).length)
//       urlDatabase[randomURL] = {}; 
//     }
//     console.log(Object.keys(urlDatabase).length)
//     assert.deepEqual(56800235586, Object.keys(urlDatabase).length);
//   });
// });

