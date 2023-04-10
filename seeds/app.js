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
    for (let i = 0 ; i< 100 ; i++){
        const random100 = Math.floor(Math.random() *100);
        const price = Math.floor(Math.random() *20) +10; 
        const camp = new Campground({
          // YOUR USER ID
            author: '642132bf988ab89284253069',
            location: `${cities[random100].city} , ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,            
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptates id, nisi aut laboriosam sunt blanditiis ipsa quaerat nihil, odio facere sapiente voluptas est nulla excepturi? Repellendus alias ex tenetur.',
            price,
            geometry:{ 
                       type : "Point" ,
                       coordinates : [
                          cities[random100].longitude,
                          cities[random100].latitude
                      ]
                      },
            image: [
              {
                url: 'https://res.cloudinary.com/dt0lyvpmu/image/upload/v1681101067/YelpCamp/sjtsxwip4cmex2mbfmje.jpg',
                filename: 'YelpCamp/sjtsxwip4cmex2mbfmje',
              },
              {
                url: 'https://res.cloudinary.com/dt0lyvpmu/image/upload/v1681101446/YelpCamp/pfzhbsxfukosz3midkic.jpg',
                filename: 'YelpCamp/pfzhbsxfukosz3midkic',
              }
            ]

        })
        await camp.save();
    }
}
seedDB().then(()=> {
    mongoose.connection.close()
})