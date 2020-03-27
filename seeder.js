const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Loading env variables
dotenv.config({ path: './config/config.env' });

//Loading Bootcamp model
const Bootcamp = require('./models/Bootcamps');

//Loading Course model
const Course = require('./models/Courses');

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

//Importing into the DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
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
    // await Course.deleteMany();
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
