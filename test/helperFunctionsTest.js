const { assert } = require('chai');

const { checkUserId, checkEmail } = require('../helperFunctions.js');

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

describe('checkUserId', function() {
  it('should return a user with valid email', function() {
    const user = checkUserId("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
});

describe('checkUserId', function() {
  it('should return undefined with invalid email', function() {
    const user = checkUserId("user3@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});

describe('checkEmail', function() {
  it('should return true if the email match', function() {
    const user = checkEmail("user@example.com", testUsers);
    const expectedUserID = true;
    assert.equal(user, expectedUserID);
  });
});

describe('checkEmail', function() {
  it('should return false if the email dosn\'t match', function() {
    const user = checkEmail("user3@example.com", testUsers);
    const expectedUserID = false;
    assert.equal(user, expectedUserID);
  });
});