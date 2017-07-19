const express = require('express');
const router  = express.Router();
const QuotesModel  = require('../models/quotes-model');

const ensureLoggedInApiVersion = require ('../lib/ensure-logged-in-api-version');

router.post('/api/quote', ensureLoggedInApiVersion, (req, res, next) => {
   QuotesModel.
   findOne({ owner: req.user_id })
   .sort({ position: -1}) //-1 = opposite order 321 -- 1 = Normal order 123
   .exec((err, lastQuotes) => {
     if (err) {
       res.status(500).json({message: 'Find list went wrong - randseed1724'});
       return;
     }
//default to 1
     let newPOsition = 1;

     if (lastQuotes) {
       // butt use the last list's postion (+1) if er have one
       newPosition = lastQuotes.positions + 1;
     }

     const theQuotes = new QuotesModel({
       quote: req.body.quote,
       quote_length: req.body.quote_length,
        author: req.body.author,
     });

      thisQuotes.save((err) => {
        if (err) {
          res.status(500).json({message: 'Find list went wrong at final step - randseed1724'});
          return;
        }
        res.status(200).json(thisQuotes);
     });
   });// close "exec()"" callback
});

router.get('/api/quotesapi', ensureLoggedInApiVersion, (req, res, next) => {
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

module.exports = router;
