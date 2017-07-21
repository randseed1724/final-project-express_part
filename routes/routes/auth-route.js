const express    = require('express');
const bcrypt     = require('bcrypt');
const passport   = require('passport');
const ensure     = require('connect-ensure-login');
const UserModel  = require('../models/user-model.js');
const router     = express.Router();


router.post('/api/signup', (req, res, next) => {
    const theFullName =  req.body.signupFullName;
    const theEmail = req.body.signupEmail;
    const thePassword = req.body.signupPassword;

    if (!theEmail || !thePassword) {
      res.status(400).json({message: "Please provide valid credentials - ranseed1724"});
      return;
    }

    UserModel.findOne(
      { email: theEmail },
       (err, userFromDb) => {

          if (err) {
             res.status(500).json({ message: "Email on Database went down - ranseed1724"});
             return;
           }

           if (userFromDb) {
             res.status(400).json({ message: "Email is taken"});
           }

           const salt = bcrypt.genSaltSync(10);
           const scrambledPassword = bcrypt.hashSync(thePassword, salt);

           // Create the user
           const theUser = new UserModel({
             fullName: theFullName,
             email: theEmail,
             encryptedPassword: scrambledPassword
           });
           // Save it
           theUser.save((err) => {
             if (err) {
               res.status(500).json({ message: "Database went down - ranseed1724"});
               return;
             }
//Log in the user automatically aftersignup
             req.login(theUser, (err) => {
                if( err) {
                  res.status(500).json({ message: "Login went down - ranseed1724"});
                  return;
                }
                res.status(200).json(theUser);
             });
       }
    );
  });
});

router.post('/api/login', (req, res, next ) => {
  const myFuntion = passport.authenticate('local', (err, theUser, failureDetails) => {
       if (err) {
         res.status(500).json({message: 'Something went really wrong - ranseed1724'});
         return;
       }
       if (!theUser) {
         // "failureDetails" contains the error mesages from our logic in Localstrategy
         // like 'Something went really wrong'
         res.status(401).json(failureDetails);
         return;
       }

      req.login(theUser, (err) => {
          if (err) {
            res.status(500).json({message: "There was an error while you were login in - ranseed1724"});
            return;
          }
          res.status(200).json(theUser);
      });
   });

   myFuntion(req, res, next);
});


router.post('/api/logout',(req, res, next) => {
   req.logout();
   res.status(200).json({message: "Success - ranseed1724"});
});

router.get('/api/checklogin',(req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unautorized - ranseed1724"});
});


module.exports = router;
