const express = require('express');
const router = express.Router();
const catchAsync = require('../uitils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

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
router.use(flash());
router.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

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

// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


//------------------------------------------------------------



const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error){
      const msg = error.details.map(el => el.message).join(',')
      throw new expressError(msg,400)
    }else {
      next()
    }
  }



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
    await campground.save();
    req.flash('success' , 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
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
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
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
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted Campground')
    res.redirect("/campgrounds");
  })
);



module.exports = router;