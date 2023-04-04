const mongoose = require("mongoose");
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require("../models/campground");

mongoose.set('strictQuery', false)
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
    for (let i = 0 ; i< 1000 ; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *20) +10; 
        const camp = new Campground({
          // YOUR USER ID
            author: '642132bf988ab89284253069',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,            
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptates id, nisi aut laboriosam sunt blanditiis ipsa quaerat nihil, odio facere sapiente voluptas est nulla excepturi? Repellendus alias ex tenetur.',
            price,
            geometry:{ 
                       type : "Point" ,
                       coordinates : [
                          cities[random1000].longitude,
                          cities[random1000].latitude
                      ]
                      },
            image: [
              {
                url: 'https://res.cloudinary.com/dt0lyvpmu/image/upload/v1680082785/YelpCamp/jbxnttlngtaqochd4d1b.jpg',
                filename: 'YelpCamp/ze5eomooeudbmtjiigen',
              },
              {
                url: 'https://res.cloudinary.com/dt0lyvpmu/image/upload/v1680065810/YelpCamp/c3j41vvjr7wusiwdcndd.jpg',
                filename: 'YelpCamp/s1i6ttmkcimu8zknv9uf',
              }
            ]

        })
        await camp.save();
    }
}
seedDB().then(()=> {
    mongoose.connection.close()
})