'use strict';

module.exports = function(app) {
  app.controller('UpdateController', ['$log', '$http', UpdateController]);

  function UpdateController($log, $http) {
    this.newGame = {winner: {name: '', score: 21, _id: ''}, loser: {name: '', score: 0, _id: ''}, date: new Date()};
    this.newPlayer = {name: ''};
    this.nameError = false;
    this.scoreError = false;
    this.loserScoreError = false;
    this.overtimeError = false;
    this.dateError = false;
    this.noPlayerChosen = false;
    this.newPlayerError = false;
    this.noNewPlayer = false;

    this.getPlayers = function() {
      $log.debug('UpdateController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
        }, (err) => {
          $log.error('error', err);
        });
    };

    this.updatePlayer = function(_id, game) {
      $log.debug('UpdateController.updatePlayer');
      let playerIndex = this.players.findIndex((player) => {
        return player._id === _id;
      });
      let player = this.players[playerIndex];
      player.games.push(game);
      $http.put(this.baseUrl + '/players/' + _id, player, this.config)
        .then((res) => {
          $log.log('successfully updated player: ' + player.name, res);
        }, (err) => {
          $log.error('error', err);
        });
    };

    this.addPlayer = function() {
      $log.debug('UpdateController.addPlayer');
      if (this.players.filter((player) => {
        return player.name.toUpperCase() == this.newPlayer.name.toUpperCase();
      }).length !== 0) {
        this.newPlayerError = true;
      } else {
        this.newPlayerError = false;
      }
      if (this.newPlayer.name.length === 0) {
        this.noNewPlayer = true;
      } else {
        this.noNewPlayer = false;
      }

      if (this.noNewPlayer === true || this.newPlayerError === true) {
        return;
      }
      $http.post(this.baseUrl + '/players', this.newPlayer, this.config)
        .then((res) => {
          this.players.push(res.data);
          this.players.sort((a, b) => {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
          this.newPlayer = {name: ''};
        }, (err) => {
          $log.error('error', err);
        });
    };


    this.addGame = function() {
      $log.debug('UpdateController.addGame');
      let now = new Date();
      now.setHours(23, 59, 59, 999);
      let winnerIndex = this.players.findIndex((player) => {
        return player.name === this.newGame.winner.name;
      });
      let loserIndex = this.players.findIndex((player) => {
        return player.name === this.newGame.loser.name;
      });
      if (this.newGame.winner.score < 21) {
        this.scoreError = true;
      } else {
        this.scoreError = false;
      }
      if (this.newGame.winner.score > 21 && this.newGame.winner.score - this.newGame.loser.score !== 2) {
        this.overtimeError = true;
      } else if (this.newGame.winner.score === 21 && this.newGame.loser.score === 20) {
        this.overtimeError = true;
      } else {
        this.overtimeError = false;
      }
      if (this.newGame.winner.score <= this.newGame.loser.score) {
        this.loserScoreError = true;
      } else {
        this.loserScoreError = false;
      }
      if (this.newGame.winner.name.length === 0 || this.newGame.loser.name.length === 0) {
        this.noPlayerChosen = true;
      } else {
        this.noPlayerChosen = false;
      }
      if (this.newGame.winner.name === this.newGame.loser.name && this.newGame.winner.name.length !== 0) {
        this.nameError = true;
      } else {
        this.nameError = false;
      }
      if (this.newGame.date > now) {
        this.dateError = true;
      } else {
        this.dateError = false;
      }

      if (this.scoreError === true || this.overtimeError === true || this.loserScoreError === true || this.nameError === true || this.dateError === true || this.noPlayerChosen === true) {
        return;
      }
      this.newGame.winner._id = this.players[winnerIndex]._id;
      this.newGame.loser._id = this.players[loserIndex]._id;
      $http.post(this.baseUrl + '/games', this.newGame, this.config)
        .then((res) => {
          $log.log('successfully posted game', res.data);
          this.updatePlayer(this.newGame.winner._id, res.data);
          this.updatePlayer(this.newGame.loser._id, res.data);
          this.newGame = {winner: {name: '', score: 21, _id: ''}, loser: {name: '', score: 0, _id: ''}, date: new Date()};
        }, (err) => {
          $log.error('error', err);
        });
    };
  }
};
