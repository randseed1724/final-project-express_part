const express = require('express');
const QuotesModel  = require('../models/quotes-model');

const router  = express.Router();

const ensureLoggedInApiVersion = require ('../lib/ensure-logged-in-api-version');



router.get('/api/user',  /*  ensureLoggedInApiVersion, */  (req, res, next) => {
  console.log("HERE", req.user._id);

    QuotesModel
      .find({ user: req.user._id })
      .populate('quote')
      .exec((err, allTheLists) => {
    if (err) {
       res.status(500).json({ message: "User was not found"});
       return;
     }

     res.status(200).json(allTheLists);
   }); // close "exec()" callback
}); // close get '/api/user'

router.get('/api/quotes',  /*  ensureLoggedInApiVersion, */  (req, res, next) => {
    ListModel
      .find({ owner: req.user._id })
      .populate('quote')
      .exec((err, allTheLists) => {
    if (err) {
       res.status(500).json({ message: "User was not found"});
       return;
     }

     res.stautes(200).json(allTheList);
   }); // close "exec()" callback
}); // close get '/api/lists'

router.post('/api/quote', /* ensureLoggedInApiVersion,*/  (req, res, next) => {
  // console.log("IN HERE", req.user._id);
   QuotesModel.
   findOne({ user: req.user._id })
   .sort({ position: 1}) //-1 = opposite order 321 -- 1 = Normal order 123
   .exec((err, lastQuotes) => {
     if (err) {
       res.status(500).json({message: 'Find list went wrong - randseed1724'});
       return;
     }
//default to 1
     let newPosition = 1;

     if (lastQuotes) {
       // butt use the last list's postion (+1) if er have one
       newPosition = lastQuotes.positions + 1;
     }

     const theQuotes = new QuotesModel({
        //  user: req.user._id,
       quote: req.body.quote,
       quote_length: req.body.quote_length,
        author: req.body.author,

     });

      theQuotes.save((err) => {
        if (err) {
          res.status(500).json({message: 'Find list went wrong at final step - randseed1724'});
          return;
        }
        res.status(200).json(theQuotes);
     });
   });// close "exec()"" callback
});



module.exports = router;
