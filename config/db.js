//Connecting to MongoDB Atlass via Compass using the URI
const mongoose = require('mongoose');

const connectDB = async () => {
  //conn returns details of the connection to the database
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  console.log(`MongoDB connected to: ${conn.connection.host}`);
};

module.exports = connectDB;
