const express = require('express');
const ensure = require('connect-ensure-login');
const bcrypt = require('bcrypt');
const User   = require('../models/user-model');
const routerUser = express.Router();

// routerUser.get('/user/:id', (req, res, next) => {

routerUser.get('/profile',
//     redirects to '/login' if you are NOT logged in
//                      |
ensure.ensureLoggedIn('/login'),
(req, res, next) => {

res.render('user/profile.ejs', {
  successMessage: req.flash('success')
});
}
);

routerUser.get('/profile/edit',

    //     redirects to '/login' if you are NOT logged in
    //                      |
  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    // If not for 'ensureLoggedIn()' we would have to do this:

    // if (!req.user) {
    //   res.redirect('/login');
    //   return;
    // }

    res.render('user/profile', {
      successMessage: req.flash('success')
    });
  }
);

// Add user email -------------------------------------------------------OOOOOOOOOO
routerUser.post('/profile/', (req, res) => {
  // What ES6 feature could we use to clean these two lines up?
  User.findByIdAndUpdate(
    req.user._id,
     {
      email: req.body.userEmail
    },
    (err, theUser) => {
      if (err) {
        next(err);
        return;
      }
      // req.flash('success', 'Changes saved');

      res.redirect('/profile/');
    }
  );
});

// <form method="post" action="/profile/edit">
routerUser.post('/profile/edit',

  ensure.ensureLoggedIn('/login'),

  (req, res, next) => {
    const profileName = req.body.profileName;
    const profileUsername = req.body.profileUsername;
    const currentPassword = req.body.profileCurrentPassword;
    const newPassword = req.body.profileNewPassword;

    User.findOne(
      { username: profileUsername },
      { username: 1 },
      (err, foundUser) => {
        if (err) {
          next(err);
          return;
        }

        // if there's a user with the username and it's not you
        if (foundUser && !foundUser._id.equals(req.user._id)) {
          res.render('user/edit-profile-view.ejs', {
            errorMessage: 'Username already taken. 😤'
          });
          return;
        }



        // add updates from form
        req.user.name = req.body.profileName;
        req.user.username = req.body.profileUsername;

        // if both passwords are filled and the current password is correct
        if (currentPassword && newPassword
            && bcrypt.compareSync(currentPassword, req.user.encryptedPassword)) {
          // add new encryptedPassword to the updates
          const salt = bcrypt.genSaltSync(10);
          const hashPass = bcrypt.hashSync(newPassword, salt);
          // profileChanges.encryptedPassword = hashPass;
          req.user.encryptedPassword = hashPass;
        }

        // save updates!
        req.user.save((err) => {
          if (err) {
            next(err);
            return;
          }

          req.flash('success', 'Changes saved. 👻');

          res.redirect('/profile/edit');
        });

        // User.findByIdAndUpdate(
        //   req.user._id,
        //   profileChanges,
        //   (err, theUser) => {
        //     if (err) {
        //       next(err);
        //       return;
        //     }
        //
        //     req.flash('success', 'Changes saved. 👻');
        //
        //     res.redirect('/profile/edit');
        //   }
        // );
      }
    );
  }
);


// Query to make people admins in MongoDB shell
// db.users.updateOne(
//   { username: 'nizar' },
//   { $set: { role: 'admin' } }
// )


routerUser.get('/users', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.find((err, usersList) => {
      if (err) {
        next(err);
        return;
      }

      res.render('user/users-list-view.ejs', {
        users: usersList,
        successMessage: req.flash('success')
      });
    });
  }

  // Otherwise show 404 page
  else {
    next();
  }
});


routerUser.post('/users/:id/admin', (req, res, next) => {
  // If you are logged in AND and admin LEZ DO THIS
  if (req.user && req.user.role === 'admin') {
    User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        req.flash('success', `User "${theUser.name}" is now an admin. 😎`);

        res.redirect('/users');
      }
    );
    return;
  }

  // Otherwise show 404 page
  else {
    next();
  }
});


module.exports = routerUser;
