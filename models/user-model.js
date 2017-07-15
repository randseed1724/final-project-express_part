const mongoose = require('mongoose');
const Quotes   = require('./quotes-model');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    name:       { type: String },
    email:      { type: String },
    profileImg: { type: String },
    role:       { type: String,
          power: [ 'customer', 'admin' ],
          default: 'customer'
    },
//  SOCIAL LOGIN
    facebookID: { type: String },
    googleID: { type: String },
//  This user interaction with Quotes
    ownQuotes:       { type: Array },
    favoritesQuotes: { type: Array },
//  Adds createdAt & updatedAt to documents
      },
      {
        timestamps: {
          createdAt: 'registration_date',
          updatedAt: 'last_update'
        }
      }
      );

const User = mongoose.model('User', userSchema);
module.exports = User;
