/**takes in an array of numbers. converts numbers to characters 
 * based on UTF-16.returns the resulting string.*/
const convertNumArrToString = function (NumArr) {
  let outputString = ""
  for (number of NumArr) {
    outputString = outputString + String.fromCharCode(number);
  }
  return outputString;
}

/** a wrapper function to give helper functions access to the relevant "database" 
 *  so we don't have to keep passing it every time we use a helper function*/
const generateUniqueStringWrapper = function (urlDatabase) {

  /**checks to see if a given unique key (6 alpha numeric digits) is unique
   * returns false if it is already in the urlDatabase, true if it is not */
  const isUnique = function (key) {
    if (urlDatabase[key]) {
      return false;
    }
    return true;
  }
  /** returns an object containing all the url records belowing to the supplied id*/
  const urlsForUser = function (id) {
    const filteredURLS = {}
    for (urlKey in urlDatabase) {
      if (urlDatabase[urlKey].userID === id) {
        filteredURLS[urlKey] = urlDatabase[urlKey];
      }
    }
    return filteredURLS;
  }
  /** generates a unique random string */
  const generateUniqueRandomString = function () {
    // we should not have more than 62^6 entries. (62 possible character. 6 entries)
    if (Object.keys(urlDatabase).length >= 56800235586) {
      return false
    }

    const randomStringAsNumbers = []

    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 62); //0-61 62 possibilities 0-9(10), a-z(26), A-Z(26)
      let charCodeOffsetNumber;
      if (randomNumber < 10) {
        charCodeOffsetNumber = randomNumber + 48; //offset 0-9 to UFT-16 codes for 0-9
        randomStringAsNumbers.push(charCodeOffsetNumber);
      } else if (randomNumber >= 10 && randomNumber < 36) {
        charCodeOffsetNumber = randomNumber + 55; //offset 10-35 to UFT-16 codes for A-Z
        randomStringAsNumbers.push(charCodeOffsetNumber);
      } else if (randomNumber >= 36 && randomNumber < 62) {
        charCodeOffsetNumber = randomNumber + 61; //off set 36-61 to UFT-16 codes for a-z
        randomStringAsNumbers.push(charCodeOffsetNumber);
      }
    }

    let characterIndex = 0;

    /** If the key already exists in our database this while loop will
     *  perform a linear probe until we find a key not in use.*/

    while (!isUnique(convertNumArrToString(randomStringAsNumbers))) {
      if (randomStringAsNumbers[characterIndex] < 61) {
        randomStringAsNumbers[characterIndex]++;
      }
      else if (characterIndex < 5) {
        characterIndex++;
      }
      else {
        for (let i = 0; i < randomStringAsNumbers.length; i++) {
          randomStringAsNumbers[i] = 0;
        }
        characterIndex = 0;
      }
    }
    return convertNumArrToString(randomStringAsNumbers);
  }
  return [generateUniqueRandomString, urlsForUser];
}

module.exports = generateUniqueStringWrapper
