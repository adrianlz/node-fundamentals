const express = require('express');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

function router() {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUserToMongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to MONGO');

          const db = client.db(dbName);

          const col = db.collection('users');
          const user = { username, password };

          const result = await col.insertOne(user);
          debug(result.ops[0]);

          debug('ajam00');
          req.login(result.ops[0], () => {
            debug('ajam01');
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        debug('not logged in...redirecting to home page');
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav: {},
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));
  return authRouter;
}


module.exports = router;
