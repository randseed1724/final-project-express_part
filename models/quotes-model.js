const mongoose = require('mongoose');
const User     = require('./user-model');
const Schema   = mongoose.Schema;

const quoteSchema = new Schema({
        author:             { type: String, default: "anonymous"},
        userCreator:               { type: Schema.Types.ObjectId, ref:'User'},
        quote:              { type: String, default: "Silence is Gold"},
        quote_length:       { type: Number, default: '0',  maxlength: 100},
        sku:      { type: String },
        category: { type: Array,
            categories: [ 'photography', 'videos', 'music',
            'writing', 'general' , 'life' , 'love', 'creativity', 'hapiness',
            'success' ],  default: 'general'
        },
        votes:    { type: Number, default: '0' },
        total_views: { type: Number, default: '0' },
    },
    {
    timestamps: true
    }
    );


const Quotes = mongoose.model('Quotes', quoteSchema);
module.exports = Quotes;
