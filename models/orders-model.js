const mongoose = require('mongoose');
const Quotes   = require('./quotes-model');
const User     = require('./quotes-model');

const Schema   = mongoose.Schema;

const orderSchema = new Schema({
    user:                { type: Schema.Types.ObjectId, ref: 'User' },
    quotes:              { type: Schema.Types.ObjectId, ref: 'Quotes' },
    status:              { type: Array,
        categories: [ 'Canceled', 'Complete', 'In Process'],  default: 'general'
    },
    date_of_purchase:    { type: Date, default: Date.now },
    },
    {
      timestamps: true
    }
    );

const Store = mongoose.model('Store', orderSchema);
module.exports = Store;
