const convertNumArrToString = function (NumArr) {
  let outputString = ""
  for (number of NumArr) {
    outputString = outputString + String.fromCharCode(number);
  }
  return outputString;
}

const generateUniqueStringWrapper = function (urlDatabase) {
  const isUnique = function (key) {
    if (urlDatabase[key]) {
      return false;
    }
    return true;
  }

  const urlsForUser = function (id) {
    const filteredURLS = {}
    for (urlKey in urlDatabase) {
      if (urlDatabase[urlKey].userID === id) {
        filteredURLS[urlKey] = urlDatabase[urlKey];
      }
    }
    return filteredURLS;
  }

  const generateUniqueRandomString = function () {

    if (Object.keys(urlDatabase).length >= 56800235586) {
      throw 'Not Possible... why do you need 56800235586 shortened urls' //62^6
    }

    const randomStringAsNumbers = []

    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 62);
      let charCodeOffsetNumber;
      if (randomNumber < 10) {
        charCodeOffsetNumber = randomNumber + 48;
        randomStringAsNumbers.push(charCodeOffsetNumber);
      } else if (randomNumber >= 10 && randomNumber < 36) {
        charCodeOffsetNumber = randomNumber + 55;
        randomStringAsNumbers.push(charCodeOffsetNumber);
      } else if (randomNumber >= 36 && randomNumber < 62) {
        charCodeOffsetNumber = randomNumber + 61;
        randomStringAsNumbers.push(charCodeOffsetNumber);
      }
    }

    let characterIndex = 0;

    while (!isUnique(convertNumArrToString(randomStringAsNumbers))) {
      /** If the key already exists in our database this while loop will basically 
       *  perform a linear probe until we find a key not in use.*/
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
