const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('../models/user');
const User = require('../models/user');
const users = require('../controllers/users')

router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const session = require('express-session');
router.use(session({
  secret:'hello',
  resave: false ,
  saveUninitialized:false,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 *60 *60 * 24 *7,
    maxAge: 1000 *60 *60 *24 *7
  }
}))

const flash = require('connect-flash');

router.use(flash());
router.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

router.route('/register')
    .get( users.renderRegister)
    .post(users.register );

router.route('/login')
    .get(users.renderLogin)
    .post( passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}), users.login);

router.get('/logout', users.logout);

module.exports = router;

















