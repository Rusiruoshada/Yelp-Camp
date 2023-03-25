// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const { url } = require("inspector");
// const Campground = require("./models/campground");
// const methodOverride = require('method-override');
// const ejsMate = require('ejs-mate')
// const catchAsync = require('./uitils/catchAsync');
// const expressError = require('./uitils/expressError');
// const {campgroundSchema,reviewSchema} = require('./schemas.js');
// const Review = require('./models/review')

// const campgrounds = require('./routes/campgrounds')
// const reviews = require('./routes/reviews')
// const session = require('express-session');
// const flash = require('connect-flash');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const User = require('./models/user');
// const usersRoutes =require('./routes/users');


// mongoose
//   .connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
//   })
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const app = express();

// mongoose.set("strictQuery", true);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.engine('ejs', ejsMate)
// app.use('/campgrounds' ,campgrounds)
// app.use('/campgrounds/:id/reviews' ,reviews)
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(session({
//   secret:'hello',
//   resave: false ,
//   saveUninitialized:false,
//   cookie: {
//     httpOnly: true,
//     expires: Date.now() * 1000 *60 *60 * 24 *7,
//     maxAge: 1000 *60 *60 * 24 *7
//   }
// }))
// app.use(session(sessionConfig))
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// app.use('/',usersRoutes)

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//--------------------------------------------------------

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const expressError = require('./uitils/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

mongoose.set('strictQuery', true);
const URL ="mongodb+srv://sample1:sample123@cluster0.5er8j14.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home');
    req.flash('success', "Goodbye!");
});


app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


//------------------------------------------------------






























