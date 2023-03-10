const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
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

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0 ; i< 50 ; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const camp = new Campground({
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
seedDB().then(()=> {
    mongoose.connection.close()
})