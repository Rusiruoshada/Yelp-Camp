const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../uitils/catchAsync");
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
  isReviewAuthor,
} = require("../middleware");
const { campgroundSchema } = require("../schemas.js");
const expressError = require("../uitils/expressError");
const Campground = require("../models/campground");

//-----------------------------------------------
// const path = require('path');
// const Review = require('../models/review');
// const usersRoutes = require('../routes/users');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const session = require("express-session");
const flash = require("connect-flash");

router.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

router.use(flash());
router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//------------------------------------------------------------

router.route('/')
  .get(catchAsync(campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
  
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
  
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;
