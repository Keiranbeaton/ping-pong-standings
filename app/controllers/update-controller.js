'use strict';

module.exports = function(app) {
  app.controller('UpdateController', ['$log', '$http', UpdateController]);

  function UpdateController($log, $http) {
    this.newGame = {winner: {name: '', score: 21, id: ''}, loser: {name: '', score: 0, id: ''}, date: new Date()};
    this.newPlayer = {name: ''};
    this.nameError = false;
    this.scoreError = false;
    this.overtimeError = false;
    this.dateError = false;
    this.newPlayerError = false;
    this.noNewPlayer = false;

    this.checkError = function(condition, result) {
      $log.debug('UpdateController.checkError');
      if (condition) {
        $log.error('evaluated as true', result);
        return result = true;
      } else {
        result = false;
      }
    };

    this.getPlayers = function() {
      $log.debug('UpdateController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
        }, (err) => {
          $log.error('error', err);
        });
    };

    this.addPlayer = function() {
      $log.debug('UpdateController.addPlayer');
      this.newPlayer.name.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      this.checkError(this.players.findIndex((oldPlayer) => {
        return oldPlayer.name === this.newPlayer.name;
      }) !== -1, this.newPlayerError);
      this.checkError(this.newPlayer.name.length === 0, this.noNewPlayer);

      $http.post(this.baseUrl + '/players', this.newPlayer, this.config)
        .then((res) => {
          this.players.push(res.data).sort((a, b) => {
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
      this.checkError(this.newGame.winner.score < 21, this.scoreError);
      this.checkError(this.newGame.winner.score > 21 && this.newGame.winner.score - this.newGame.loser.score !== 2, this.overtimeError);
      this.checkError(this.newGame.winner.name === this.newGame.loser.name, this.nameError);
      let now = new Date();
      now.setHours(23, 59, 59, 999);
      this.checkError(this.newGame.date > now, this.dateError);
      let winnerIndex = this.players.findIndex((player) => {
        return player.name === this.game.winner.name;
      });
      let loserIndex = this.players.findIndex((player) => {
        return player.name === this.game.loser.name;
      });
      this.game.winner.id = this.players[winnerIndex]._id;
      this.game.loser.id = this.players[loserIndex].id;

      $http.post(this.baseUrl + '/games', this.newGame, this.config)
        .then((res) => {
          $log.log('success', res);
          this.newGame = {winner: {name: '', score: 21, id: ''}, loser: {name: '', score: 0, id: ''}, date: new Date()};
        }, (err) => {
          $log.error('error', err);
        });
    };
  }
};
