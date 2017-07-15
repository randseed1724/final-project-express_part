const express = require('express');
const router = express.Router();
const app = express();
const quotesModel = require('../models/quotes-model');
app.use('/', quotesModel);


//middleware
const ensure = require('connect-ensure-login');
const multer = require('multer');
const myUploader = multer({dest: 'public/images'});
const path = require('path');


/* GET contest page. */
router.get('/contest',
  // We need to be logged in to see contest page
  ensure.ensureLoggedIn('/login'),
  (req, res, next) => {

    quotesModel.find({}, (err, contestArray) => {
      if (err) { return next(err); }

    res.render('contest/index', {
      title: 'All contest',
      contest: contestArray

    });
  });
});





router.get('/contest/new',
  // We need to be logged in to see contest page
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {

    quotesModel.find({}, (err, moviesArray) => {
    if (err) { return next(err); }

    res.render('contest/new', {
      title: 'Congratulations',
    });
  });
});


router.post('/contest/new',
  // We need to be logged in to see contest page
  ensure.ensureLoggedIn('/login'),
  myUploader.single('contestImage'),
  (req, res, next) => {
    console.log("---------------------------------");
    console.log(req.body);
    const newContest = new quotesModel({
      // PART 1
          //categories
          category: (req.body.photography || req.body.video ||
          req.body.music || req.body.writing),

          //image
          contestImage: `/images/${req.file.filename}`,

      // PART 2
          name: req.body.contestName,
          caesarThump: req.body.contestThump,
          aboutYou: req.body.aboutYou,
          description: req.body.contestDescription,
          //type of award
          typeAward: req.body.typeAward,
      // PART 3
          describeAward: req.body.describeAward,
          providingAward: req.body.providingAward,
          //number of winners
          totalWinners: req.body.manyWinners,
    });
    newContest.save((err) => {
      if(err){
        next(err);
        return;
      }
      res.redirect(`/contest/${newContest._id}`);
    });
  });

router.get('/contest/:id', function (req, res, next) {
  quotesModel.findOne({_id: req.params.id}, (err, theContest) => {
    if (err) { return next(err); }
    res.render('contest/show', {
      title: theContest.name,
      contest: theContest
    });
  });
});

//EDIT GET
router.get('/contest/:id/edit', function (req, res, next) {
  quotesModel.findOne({ _id: req.params.id }, (err, theContest) => {
    if (err) { return next(err); }

    res.render('contest/edit', {
      title: `Edit ${theContest.name}`,
      contest: theContest
    });
  });
});

//EDIT POST
router.post('/contest/:id', function (req, res, next) {
  const updatedContest = {
    // PART 1
        //categories
        category: (req.body.photography || req.body.video ||
        req.body.music || req.body.writing),

        //image

        contestImage: (req.file) ? `/images/${req.file.filename}`:'null',

    // PART 2
        name: req.body.contestName,
        caesarThump: req.body.contestThump,
        aboutYou: req.body.aboutYou,
        description: req.body.contestDescription,
        //type of award
        typeAward: req.body.typeAward,
    // PART 3
        describeAward: req.body.describeAward,
        providingAward: req.body.providingAward,
        //number of winners
        totalWinners: req.body.manyWinners,
  };
  quotesModel.update({_id: req.params.id}, updatedContest, (err, theContest) => {
    if (err) {return next(err); }
    res.redirect('/contest/'+req.params.id);
  });
});


// Delete
router.post('/contest/:id/delete', function(req, res, next) {
  quotesModel.findOne({ _id: req.params.id }, (err, theContest) => {
    if (err) { return next(err); }

    theContest.remove((err) => {
      if (err) { return next(err); }

      res.redirect('/contest');
    });
  });
});


  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });



module.exports = router;
