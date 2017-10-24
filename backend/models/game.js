'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let gameSchema = mongoose.Schema({
  winner: {
    name: {type: String, required: true},
    score: {type: Number, required: true},
    _id: {type: mongoose.Schema.Types.ObjectId, required: true}
  },
  loser: {
    name: {type: String, required: true},
    score: {type: Number, required: true},
    _id: {type: mongoose.Schema.Types.ObjectId, required: true}
  },
  date: {type: Date, default: Date.now}
});

module.exports = exports = mongoose.model('Game', gameSchema);
