const express = require('express');
const router = express.Router();
const app = express();
const quotesSeeds = require('../models/quotes-model');
app.use('/', quotesSeeds);


//middleware
const ensure = require('connect-ensure-login');
const multer = require('multer');
const myUploader = multer({dest: 'public/images'});
const path = require('path');


/* GET contest page. */

// router.get('/api/quotes', function(req, res, next) {
//   quotesSeeds.find({}, (err, quoteArray) => {
//     if (err) { return next(err); }
//     res.json(quoteArray);
//
//
//   });
// });


module.exports = router;
