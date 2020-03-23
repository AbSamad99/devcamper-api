const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to DB
connectDB();

//Importing Routes
const bootcamps = require('./routes/bootcamps');

const app = express();

//Using Body Parser Middleware
app.use(express.json());

//Using Morgan Middleware in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});

//Handling Unhandled Rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`);
  //close server and exit process
  server.close(() => process.exit(1));
});
