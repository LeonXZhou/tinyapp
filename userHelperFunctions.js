const userHelperFunctionWrapper = function(users)
{
  /** returns the user id for a given email */
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
  /** checks if the supplied email is unique in the user database */
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

  return {checkEmailUniqueness, getUID};
}

module.exports = userHelperFunctionWrapper;