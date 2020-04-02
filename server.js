const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const expressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to DB
connectDB();

//Importing Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//Using Body Parser Middleware
app.use(express.json());

//Using Morgan Middleware in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File upload middleware
app.use(fileupload());

//Using express mongo sanitize middleware
app.use(expressMongoSanitize());

//Using Cookie parser middleware
app.use(cookieParser());

//Using helmet middleware, used to set security headers
app.use(helmet());

//Using xss-clean middleware, used to prevent cross site scripting attacks
app.use(xss());

//Using Reate limiting middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100
});

app.use(limiter);

//Using the CORS middleware
app.use(cors());

//Using the hpp middleware to prevent http param pollution
app.use(hpp());

//Setting public folder as static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

//Using Error Handling Middleware,
//IMP: Must be called after the routes
app.use(errorHandler);

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
