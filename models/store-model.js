const mongoose = require('mongoose');
const Quotes   = require('./quotes-model');
const User     = require('./quotes-model');
const Orders   = require('./orders-model');


const Schema   = mongoose.Schema;

const storeSchema = new Schema({
    user:       { type: Schema.Types.ObjectId, ref: 'User' },
    quotes:     { type: Schema.Types.ObjectId, ref: 'Quotes' },
    orders:     { type: Schema.Types.ObjectId, ref: 'Orders' },
    },
    {
      timestamps: true
    }
    );

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
