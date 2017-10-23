'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Player = require('../models/player');
const debug = require('debug')('player-router');

let playerRouter = module.exports = exports = Router();

playerRouter.post('/', jsonParser, (req, res, next) => {
  debug('POST /api/players');
  let newPlayer = new Player();
  newPlayer.name = req.body.name;
  newPlayer.games = [];
  newPlayer.save().then((player) => {
    res.json(player);
  }, (err) => {
    next(createError(400, err.message));
  });
});

playerRouter.get('/', (req, res, next) => {
  debug('GET /api/players');
  Player.find().populate('games').then((players) => {
    res.send(players);
  }).catch(next);
});

playerRouter.get('/:id', (req, res, next) => {
  debug('GET /api/players/:id');
  Player.findById(req.params.id).populate('games')
    .then((player) => {
      res.send(player);
    }).catch((err) => {
      next(createError(404, err.message));
    });
});

playerRouter.put('/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/players/:id');
  req.body.name = req.body.name.toLowerCase();
  let pointsFor = 0;
  let pointsAgainst = 0;
  let wins = 0;
  let losses = 0;
  req.body.games.forEach((game) => {
    if (game.winner.id === req.body._id) {
      wins += 1;
      pointsFor += game.winner.score;
      pointsAgainst += game.loser.score;
    } else {
      losses += 1;
      pointsFor += game.loser.score;
      pointsAgainst += game.winner.score;
    }
  });
  req.body.wins = wins;
  req.body.losses = losses;
  req.body.pointsFor = pointsFor;
  req.body.pointsAgainst = pointsAgainst;
  Player.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then((player) => {
      res.send(player);
    }).catch(() => {
      next(createError(404, 'Player Id Not Found'));
    });
});
