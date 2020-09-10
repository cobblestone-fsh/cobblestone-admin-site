
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const { ADMIN_WHITELIST } = require('./config');

const adminRouter = require('./admin');

const app = express();

store = new MongoDBStore({
  uri: `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?connectTimeoutMS=30000`,
  collection: 'sessions'
});

app.use(session({
  secret: process.env.SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH_ZERO_DOMAIN,
    clientID: process.env.AUTH_ZERO_CLIENT_ID,
    clientSecret: process.env.AUTH_ZERO_CLIENT_SECRET,
    callbackURL: '/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {

    if (!req.user) {
      throw new Error('user null');
    }
    if (ADMIN_WHITELIST.indexOf(req.user.user_id) != -1) {
      req.session.isAdmin = true;
    }

    res.redirect("/");
  }
);

app.get('/login',
  passport.authenticate('auth0', { scope: 'openid profile' }),
  function (req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  }
);

app.get('/logout', function(req, res) {
  req.session.isAdmin = false;
  req.logout();
  res.redirect('/');
});

app.get('/', (req, res) => {
  return res.send("HOME");
});

function adminGuard(req, res, next) {
  if (!req.session.isAdmin) {
    res.send("BLOCKED!");
  } else {
    next();
  }
}

app.use('/admin', adminGuard, adminRouter);

module.exports = app;
