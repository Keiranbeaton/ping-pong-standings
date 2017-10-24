'use strict';

module.exports = function(app) {
  app.controller('HomeController', ['$log', '$http', HomeController]);

  function HomeController($log, $http) {
    this.players = [];
    this.getPlayers = function() {
      $log.debug('HomeController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
          this.players.forEach((player) => {
            player.percentage = parseFloat(player.wins / player.games.length).toFixed(3);
            player.differential = player.pointsFor - player.pointsAgainst;
          });
          this.players.sort((a, b) => {
            return b.percentage - a.percentage;
          });
          console.log('this.players', this.players);
        });
    };

    this.sortName = function() {
      $log.debug('HomeController.sortName');
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
    };

    this.sortWins = function() {
      $log.debug('HomeController.sortWins');
      this.players.sort((a, b) => {
        return b.wins - a.wins;
      });
    };

    this.sortLosses = function() {
      $log.debug('HomeController.sortLosses');
      this.players.sort((a, b) => {
        return a.losses - b.losses;
      });
    };

    this.sortPct = function() {
      $log.debug('HomeController.sortPct');
      this.players.sort((a, b) => {
        return b.percentage - a.percentage;
      });
    };

    this.sortDiff = function() {
      $log.debug('HomeController.sortDiff');
      this.players.sort((a, b) => {
        return b.differential - a.differential;
      });
    };
  }
};
