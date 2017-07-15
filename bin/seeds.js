const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotes-wall-app');

const Quote = require('../models/quotes-model');

const quotes = [
  {
    author: "Arthur Ashe",
    quote: "Start where you are. Use what you have. Do what you can.",
    quote_length: 56,
    sky: "MQJUL1",
    category: ['success'],
    votes: 95,
    total_views: 420,
  },
  {
    author: "Elbert Hubbard",
    quote: "Do not take life too seriously. You will never get out of it alive.",
    quote_length: 67,
    sky: "MQJUL2",
    category: ['life'],
    votes: 125,
    total_views: 242,
  },
  {
    author: "Margaret Mead",
    quote: "Always remember that you are absolutely unique. Just like everyone else.",
    quote_length: 72,
    sky: "MQJUL3",
    category: ['hapiness'],
    votes: 72,
    total_views: 90,
  },
  {
    author: "Hans Christian Andersen",
    quote: "Where words fail, music speaks.",
    quote_length: 31,
    sky: "MQJUL4",
    category: ['music'],
    votes: 22,
    total_views: 124,
  },
  {
    author: "Mahatma Gandhi",
    quote: "You must be the change you wish to see in the world.",
    quote_length: 52,
    sky: "MQJUL4",
    category: ['life'],
    votes: 2059,
    total_views: 4300,
  },
  {
    author: "Osho",
    quote: "Creativity is the greatest rebellion in existence.",
    quote_length: 50,
    sky: "MQJUL5",
    category: ['creativity'],
    votes: 43,
    total_views: 65,
  },
];



Quote.create(quotes, (err, savedQuotes) => {
  if (err) { throw err; }
  mongoose.disconnect();
});
