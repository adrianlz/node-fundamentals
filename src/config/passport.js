const passport = require('passport');
const debug = require('debug')('app:passport');

require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  debug('ajam1');
  passport.serializeUser((user, done) => {
    debug(user);
    debug('ajam2');
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    debug('ajam3');
    done(null, user);
  });
};
