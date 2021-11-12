const userHelperFunctionWrapper = function(users)
{
  const getUID = function (newEmail)
  {
    for (const user in users)
    {
      if (users[user].email === newEmail)
      {
        return users[user].id
      }
    }
  }

  const checkEmailUniqueness = function(newEmail)
  {
    for (const user in users)
    {
      if (users[user].email === newEmail)
      {
        return false;
      }
    }
    return true;
  }

  /**
   * Will need to revisit the authenticate function to see how to implement it asyncronously.
   * Currently authentication is happening in the post route for login (not very modular, big sad)
   */

  // const authenticateUser = function(testEmail,testPassword)
  // {
  //   if (!checkEmailUniqueness(testEmail))
  //   {
  //     if(users[getUID(testEmail)].password === testPassword)
  //     {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  return {checkEmailUniqueness, getUID};
}

module.exports = userHelperFunctionWrapper;