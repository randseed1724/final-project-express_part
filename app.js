const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const logger            = require('morgan');
const cookieParser      = require('cookie-parser');
const bodyParser        = require('body-parser');
const layouts           = require('express-ejs-layouts');
const dotenv            = require('dotenv');
const config            = require('config');
const flash             = require('connect-flash');
const cors              = require('cors');
const authRoutes        = require('./routes/auth-route');
const session           = require('express-session');
const passport          = require('passport');
const mongoose          = require('mongoose');


// Load our ENVIRONMENT VARIABLES from the .env file in dev
// (this is for dev only, but in prod it just doesn't do anything)
require('dotenv').config();
dotenv.load();


// Tell node to run the code contained in this file
// (this sets up passport and our strategies)

mongoose.connect(process.env.MONGODB_URI);
const passportSetup = require('./config/passport-config.js');
passportSetup(passport);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Wall Quotes';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts);
app.use( session({
  secret: 'angular auth passport secret shh',
  // these two options are there to prevent warnings in terminal
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));
// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes




app.use(flash());

// This middleware sets the user variable for all views
// (only if logged in)
//   user: req.user     for all renders!
app.use((req, res, next) => {
  if (req.user) {
    // Creates a variable "user" for views
    res.locals.user = req.user;
  }

  next();
});

// If you are in production do this
// app.use(cors());
// If you are in dev do this
app.use(cors({
  credentials: true,
  origin: ["http://localhost:4200"]
}));

//ROUTES  <<<< -------------------------------------------------
//^^^^^^  -------------------------------------------------
const index = require('./routes/index-route');
app.use('/', index);

const userIn = require('./routes/user-route');
app.use('/', userIn);

const myAuthRoutes = require('./routes/auth-route');
app.use('/', myAuthRoutes);

const quotes = require('./routes/quotes-route');
app.use('/', quotes);

const quotesSeeds = require('./routes/quotes-seeds-route');
app.use('/', quotesSeeds);

const quotesAPIroute = require('./routes/quote-api-route');
app.use('/', quotesAPIroute);

// ----------------------------------------------------------
//ACTIVAR AL FINAL
// app.use((req, res, next) => {
//   res.sendfile(__dirname + '/public/index.html');
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
