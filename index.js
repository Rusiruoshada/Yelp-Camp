const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { url } = require("inspector");
const Campground = require("./models/campground");
const URL =
  "mongodb+srv://sample1:sample123@cluster0.5er8j14.mongodb.net/?retryWrites=true&w=majority";

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

mongoose.set("strictQuery", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get('/campgrounds', async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/:id' , async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
})

app.listen(3000, () => {
  console.log("Serving on port 3000");
});

