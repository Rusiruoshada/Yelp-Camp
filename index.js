const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { url } = require("inspector");
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const catchAsync = require('./uitils/catchAsync');
const expressError = require('./uitils/expressError');
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const Review = require('./models/review')
const URL ="mongodb+srv://sample1:sample123@cluster0.5er8j14.mongodb.net/?retryWrites=true&w=majority";
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const session = require('express-session');




mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const sessionConfig = {
  secret:'hello',
  resave: false ,
  saveUninitialized:true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 *60 *60 * 24 *7,
    maxAge: 1000 *60 *60 * 24 *7
  }
}


mongoose.set("strictQuery", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use('/campgrounds' ,campgrounds)
app.use('/campgrounds/:id/reviews' ,reviews)
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(sessionConfig))




app.get("/", (req, res) => {
  res.render("home");
});



app.all('*', (req,res,next) => {
  next(new expressError('Page Not Found' , 404));
})

app.use((err,req,res,next) => {
  const {statusCode=500 } = err
  if(!err.message) err.message = 'Oh no, Something went wrong!!'
  res.status(statusCode).render('error',{err})
})



































app.listen(3000, () => {
  console.log("Serving on port 3000");
});
