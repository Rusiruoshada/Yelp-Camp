const express = require('express');
const router = express.Router();
const catchAsync = require('../uitils/catchAsync');
const {isLoggedIn,isAuthor,validateCampground , isReviewAuthor} = require('../middleware');
const { campgroundSchema } = require('../schemas.js');
const expressError = require('../uitils/expressError');
const Campground = require("../models/campground");

//-----------------------------------------------
// const path = require('path');
// const Review = require('../models/review');
// const usersRoutes = require('../routes/users');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const session = require('express-session');
const flash = require('connect-flash');


router.use(session({
  secret:'hello',
  resave: false ,
  saveUninitialized:false,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 *60 *60 * 24 *7,
    maxAge: 1000 *60 *60 * 24 *7
  }
}))

router.use(flash());
router.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//------------------------------------------------------------

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    review.author = req.user._id;
    await campground.save();
    req.flash('success' , 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      {path:'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
    if (!campground) {
      req.flash('error','Cannot find that campgeound')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error','Cannot find that campgeound')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success' , 'Successfully updated Campgeound!')
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted Campground')
    res.redirect("/campgrounds");
  })
);



module.exports = router;