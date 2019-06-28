'use strict';

const bcrypt = require('bcrypt-nodejs'),
  Boom = require('boom'),
  User = require('../models/user'),
  DynamoStore = require('./dynamoStore');

const saltRounds = 10;

function createUser (username, passwordString, callback) {
  hashPassword(passwordString, (err, passwordHash) => {
    let user = new User(username, passwordHash);
    DynamoStore.putItem('users', user, (err, data) => {
      callback(null, user);
    });
  });
};

function getUser (username, callback) {
  DynamoStore.getItem('users', 'username', username, (err, data) => {
    callback(null, dynamoItemToUser(data.Item));
  });
};

function authenticateUser (username, passwordString, callback) {
  getUser(username, (err, user) => {
    if (err || !user) callback('User not found');
    else validatePassword(passwordString, user.passwordHash, (err, res) => {
      callback(err, res, res ? user : null);
    });
  });
};

function validatePassword (passwordString, passwordHash, callback) {
  bcrypt.compare(passwordString, passwordHash, (err, res) => {
    callback(err, res);
  });
}

function hashPassword (passwordString, callback) {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) callback(err);
    else bcrypt.hash(passwordString, salt, null, (err, hash) => {
      callback(err, hash);
    });
  });
}

function dynamoItemToUser (item) {
  return new User(item.username.S, item.passwordHash.S);
}

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.authenticateUser = authenticateUser;
