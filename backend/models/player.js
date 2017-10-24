'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

let playerSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
  wins: {type: Number, required: true},
  losses: {type: Number, required: true},
  pointsFor: {type: Number, required: true},
  pointsAgainst: {type: Number, required: true}
});

module.exports = exports = mongoose.model('Player', playerSchema);
