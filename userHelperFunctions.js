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
      console.log('4', newEmail,users[user].email)
      if (users[user].email === newEmail)
      {
        return false;
      }
    }
    return true;
  }

  const authenticateUser = function(testEmail,testPassword)
  {
    console.log("1")
    if (!checkEmailUniqueness(testEmail))
    {
      console.log("2")
      if(users[getUID(testEmail)].password === testPassword)
      {
        console.log("3")
        return true;
      }
    }
    return false;
  }
  return {checkEmailUniqueness,authenticateUser,getUID};
}

module.exports = userHelperFunctionWrapper;