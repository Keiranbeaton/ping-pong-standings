'use strict';

module.exports = function(app) {
  app.controller('UpdateController', ['$log', '$http', '$rootScope', UpdateController]);

  function UpdateController($log, $http, $rootScope) {
    this.newGame = {winner: {name: '', score: 0, id: ''}, loser: {name: '', score: 0, id: ''}, date: Date.now()};
    this.newPlayer = {name: ''};

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
      $http.post(this.baseUrl + '/players', this.newPlayer, this.config)
        .then((res) => {
          this.players.push(res.data);
        }, (err) => {
          $log.error('error', err);
        });
    };

    this.addGame = function() {
      $log.debug('UpdateController.addGame');
      $http.post(this.baseUrl + '/games', this.newGame, this.config)
        .then((res) => {
          $log.log('success', res);
        }, (err) => {
          $log.error('error', err);
        });
    };
  }
};
