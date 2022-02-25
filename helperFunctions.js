 
const checkEmail = function(email, userData) {
  for (let userId in userData) {
    if (email === userData[userId].email) {
      return true;
    }
  }
  return false;
};

const checkUserId = function(email, userData)  {
  for (let id in userData) {
    if (email === userData[id].email) {
      return id;
    }
  }
  return undefined;
};

// Random string generator
const generateRandomString = () => {
  const string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const arr = [];
  for (let i = 0; i < 6; i++) {
    arr.push(string[Math.floor(Math.random() * 62)]);
  }
  return arr.join("");
};
module.exports = {checkEmail, checkUserId, generateRandomString};