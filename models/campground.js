const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set("strictQuery", true);
const URL =
  "mongodb+srv://sample1:sample123@cluster0.5er8j14.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to the DB");
  })
  .catch((err) => {
    console.log(err, "ops error");
  });


const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground',CampgroundSchema);



