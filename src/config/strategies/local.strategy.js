const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local-strategy');
const { MongoClient } = require('mongodb');

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    (async function addUserToMongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected correctly to MONGO');

        const db = client.db(dbName);

        const col = db.collection('users');

        const user = await col.findOne({ username });
        debug(user);
        if (user.password && user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }));
};
