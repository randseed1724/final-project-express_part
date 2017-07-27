const mongoose = require('mongoose');
const User     = require('./user-model');
const Schema   = mongoose.Schema;

const quoteSchema = new Schema({
        user:               { type: Schema.Types.ObjectId, ref:'User'},
        quote:              { type: String, default: "Silence is Gold"},
        author:             { type: String, default: "anonymous"},
        order:              { type: Number, default: '0'},
        category: { type: Array,
            categories: [ 'photography', 'videos', 'music',
            'writing', 'general' , 'life' , 'love', 'creativity', 'hapiness',
            'success' ],  default: 'general'
        },
        // sku:      { type: String },
        // votes:              { type: Number, default: '0' },
        // total_views:        { type: Number, default: '0' },
        featured:           { type: Boolean, default: false }
    },
    {
    timestamps: true
    }
    );


const Quotes = mongoose.model('Quotes', quoteSchema);
module.exports = Quotes;
