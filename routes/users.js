const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('../models/user');
const User = require('../models/user');

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

router.get('/register', (req,res) => {
    res.render('users/register');
})

router.post('/register', (async(req,res,next) => {
    try {
        const {email,username, password } = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=> {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp camp');
            res.redirect('/campgrounds');
        })
        } catch(e) {
            req.flash('error', e.message);
            res.redirect('/register');
        }
}))

router.get('/login' ,(req,res) => {
    res.render('users/login')
})

router.post('/login' , passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res) => {
    req.flash('success','Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo ;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout()
      req.flash('success', "Goodbye!");
      res.redirect('/campgrounds');
  }); 

module.exports = router;

















