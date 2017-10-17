'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Game = require('../models/game');
const debug = require('debug')('game-router');

let gameRouter = module.exports = exports = Router();

gameRouter.post('/', jsonParser, (req, res, next) => {
  debug('POST /api/games');
  let newGame = new Game;
  newGame.winner.score = req.body.winner.score;
  newGame.winner.name = req.body.winner.name;
  newGame.winner.id = req.body.winner._id;
  newGame.loser.score = req.body.loser.score;
  newGame.loser.name = req.body.loser.name;
  newGame.loser.id = req.body.loser._id;
  newGame.date = req.body.date;
  newGame.save().then((game) => {
    res.json(game);
  }, (err) => {
    next(createError(400, err.message));
  });
});

gameRouter.get('/', (req, res, next) => {
  debug('GET /api/games');
  Game.find().then((games) => {
    res.send(games);
  }).catch(next);
});
