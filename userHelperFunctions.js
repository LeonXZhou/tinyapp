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

  const authenticateUser = function(testEmail,testPassword)
  {
    if (!checkEmailUniqueness(testEmail))
    {
      if(users[getUID(testEmail)].password === testPassword)
      {
        return true;
      }
    }
    return false;
  }
  return {checkEmailUniqueness,authenticateUser,getUID};
}

module.exports = userHelperFunctionWrapper;