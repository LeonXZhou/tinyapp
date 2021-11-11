const userHelperFunctionWrapper = function(users)
{
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
  return checkEmailUniqueness;
}

module.exports = userHelperFunctionWrapper;