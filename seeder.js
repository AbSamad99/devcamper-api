const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Loading env variables
dotenv.config({ path: './config/config.env' });

//Loading Bootcamp model
const Bootcamp = require('./models/Bootcamps');

//Loading Course model
const Course = require('./models/Courses');

//Loading User model
const User = require('./models/Users');

//Loading Review model
const Review = require('./models/Reviews');

//Connecting to the DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//Read the JSON files, utf-8 is encoding type
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

//Importing into the DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//Delete data from DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Deleted');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
