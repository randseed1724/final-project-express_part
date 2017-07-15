const express      = require('express');
const router  = express.Router();
const contestModel = require('../models/quotes-model');



router.get('/', (req, res, next) => {

  // Render a completely different view for logged in users
  // if (req.user) {
  //   res.render('logged-in-home.ejs');
  // } else {
  //   res.render('index');
  // }

  //   res.render('index', {});
  // });

      contestModel.find({}, (err, contestArray) => {
        if (err) { return next(err); }

    res.render('index', {
      contest: contestArray
      //                          |
  // }); //        default success message key from Passport
  });
  });
});


    function onClick(){
      clicks++;
    }


//EDIT POST
router.post('/', function (req, res, next) {
    const updatedContest = {
            votes: req.body.vote,
      };
      contestModel.update({_id: req.params.id}, updatedContest, (err, theContest) => {
        if (err) {return next(err); }
        res.redirect('/'+req.params.id);
      });
    });



module.exports = router;
