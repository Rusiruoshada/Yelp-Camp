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
        const price = Math.floor(Math.random() *20) +10; 
        const camp = new Campground({
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/7370834',
            // image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=405&q=80',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptates id, nisi aut laboriosam sunt blanditiis ipsa quaerat nihil, odio facere sapiente voluptas est nulla excepturi? Repellendus alias ex tenetur.',
            price

        })
        await camp.save();
    }
}
seedDB().then(()=> {
    mongoose.connection.close()
})