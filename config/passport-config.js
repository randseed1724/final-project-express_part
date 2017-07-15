// PASSPORT GOES THROUGH THIS
// 1. Our form
// 2. LocalStrategy callback
// 3. (if successful) passport.serializeUser()

const passport = require('passport');
const bcrypt = require('bcrypt');
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
// The same as:
// const passportLocal = require('passport-local');
// const LocalStrategy = passportLocal.Strategy;


const User = require('../models/user-model.js');


// Determines WHAT TO SAVE in the session (what to put in the box)
// (called when you log in)
passport.serializeUser((user, cb) => {
  // "cb" is short for "callback"
  cb(null, user._id);
});


// Where to get the rest of the user's information (given what's in the box)
// (called on EVERY request AFTER you log in)
passport.deserializeUser((userId, cb) => {
  // "cb" is short for "callback"

  // query the database with the ID from the box
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }

    // sending the user's info to passport
    cb(null, theUser);
  });
});


passport.use( new FbStrategy(
  {
    clientID: process.env.FB_APP_ID,          // Facebook App ID
    clientSecret: process.env.FB_APP_SECRET,  // Facebook App Secret
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
  },           //            |
               // address for a route in our app


  (req, accessToken, refreshToken, profile, done) => {

    // Set the user's provider data and include tokens
          var providerData = profile._json;
          providerData.accessToken = accessToken;
          providerData.refreshToken = refreshToken;

    User.findOne(
      { facebookID: profile.id },
      (err, foundUser) => {
        if (err) {
          done(err);
          return;
        }
        // If user is already registered, just log them in!
        if (foundUser) {
          done(null, foundUser);
          return;
        }

        // Create the user OAuth profile
        // Register the user if they are not registered
        const theUser = new User({
          facebookID: profile.id,
          name: profile.displayName,
          profileImg: profile.photos[0].value,
          email: profile.emails[0].value
        });

        theUser.save((err) => {
          if (err) {
            done(err);
            return;
          }

          // This logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
) );


passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
  },           //            |
               // address for a route in our app
  (accessToken, refreshToken, profile, done) => {
    // console.log('');
    // console.log('GOOGLE PROFILE ~~~~~~~~~~~~~~~~~~~~~');
    // console.log('accessToken:  ', accessToken);
    // console.log("refreshToken: ", refreshToken);
    //
    // console.log("profile:", profile);
    // console.log("done: ", done);
    // if (theUser) {
    //     //       false in 2nd arg means "Log in failed!"
    //     //         |
    //   next(null, false, { message: 'Wrong username, buddy.' });
    //   return;  //   |
    // }          //   v
               // message -> req.flash('error')

    User.findOne(
      { googleID: profile.id },

      (err, foundUser) => {
        if (err) {
          done(err);
          return;
        }

        // If user is already registered, just log them in!
        if (foundUser) {
          done(null, foundUser);
          return;
        }

        // Register the user if they are not registered
        const theUser = new User({
          googleID: profile.id,
          name: profile.displayName,
          profileImg: profile.photos[0].value,
          email: profile.emails[0].value
        });

        // If name is empty, save the email as the "name".
        if (!theUser.name) {
          theUser.name = profile.emails[0].value;
        }

        theUser.save((err) => {
          if (err) {
            done(err);
            return;
          }

          // This logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
) );

// PASSPORT STRATEGY - ANGULAR VALIDATION
module.exports = function (passport) {

passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: 'Incorrect username' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: 'Incorrect password' });
        return;
      }

      next(null, foundUser);
    });
  }));

  //NIZAR WAY
  passport.use(new LocalStrategy(
 {
   usernameField: 'loginEmail',
   passwordField: 'loginPassword'
 },
    (apiEmail, apiPassword, next) => {
      User.findOne(
        { email: apiEmail },
        (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        if (!userFromDb) {
          next(null, false, { message: 'Invalid Email' });
          return;
        }
        if (!bcrypt.compareSync(apiPassword, userFromDb.encryptedPassword)) {
          next(null, false, { message: 'Invalid password' });
          return;
        }
        next(null, foundUser);
      });
    }));

//before
  // passport.use(new LocalStrategy((username, password, next) => {
  //     User.findOne({ username }, (err, foundUser) => {
  //       if (err) {
  //         next(err);
  //         return;
  //       }
  //
  //       if (!foundUser) {
  //         next(null, false, { message: 'Incorrect username' });
  //         return;
  //       }
  //
  //       if (!bcrypt.compareSync(password, foundUser.password)) {
  //         next(null, false, { message: 'Incorrect password' });
  //         return;
  //       }
  //
  //       next(null, foundUser);
  //     });
  //   }));


  passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
  });

  passport.deserializeUser((userIdFromSession, cb) => {
    User.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        cb(err);
        return;
      }

      cb(null, userDocument);
    });
  });
};

// PASSPORT STRATEGY FOUND HERE

// passport.use( new LocalStrategy(
//   // 1st arg -> options to customize LocalStrategy
//   {
//       // <input name="loginUsername">
//     usernameField: 'loginUsername',
//       // <input name="loginPassword">
//     passwordField: 'loginPassword'
//   },
//
//   // 2nd arg -> callback for the logic that validates the login
//   (loginUsername, loginPassword, next) => {
//     User.findOne(
//       { username: loginUsername },
//
//       (err, theUser) => {
//         // Tell Passport if there was an error (nothing we can do)
//         if (err) {
//           next(err);
//           return;
//         }
//
//         // Tell Passport if there is no user with given username
//         if (!theUser) {
//             //       false in 2nd arg means "Log in failed!"
//             //         |
//           next(null, false, { message: 'Wrong username, buddy. 😓' });
//           return;  //   |
//         }          //   v
//                    // message -> req.flash('error')
//
//         // Tell Passport if the passwords don't match
//         if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
//             //       false in 2nd arg means "Log in failed!"
//             //         |
//           next(null, false, { message: 'Wrong password, friend.' });
//           return;  //   |
//         }          //   v
//                    // message -> req.flash('error')
//
//         // Give Passport the user's details (SUCCESS!)
//         next(null, theUser, {
//           // message -> req.flash('success')
//           message: `Login for ${theUser.username} successful.`
//         });
//           // -> this user goes to passport.serializeUser()
//       }
//     );
//   }
// ) );
