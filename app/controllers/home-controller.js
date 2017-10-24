'use strict';

module.exports = function(app) {
  app.controller('HomeController', ['$log', '$http', HomeController]);

  function HomeController($log, $http) {
    this.players = [];
    this.orderProperty = '-percentage';
    this.getPlayers = function() {
      $log.debug('HomeController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
          this.players.forEach((player) => {
            if (player.games.length > 0) {
              player.percentage = parseFloat(player.wins / player.games.length).toFixed(3);
              player.differential = player.pointsFor - player.pointsAgainst;
              player.averageFor = parseFloat(player.pointsFor / player.games.length).toFixed(1);
              player.averageAgainst = parseFloat(player.pointsAgainst / player.games.length).toFixed(1);
              player.averageDiff = (player.pointsFor - player.pointsAgainst) / player.games.length;
            } else {
              player.percentage = parseFloat(0).toFixed(3);
              player.differential = 0;
              player.averageFor = parseFloat(0).toFixed(1);
              player.averageAgainst = parseFloat(0).toFixed(1);
              player.averageDiff = 0;
            }
          });
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

    this.setOrderProperty = function(property) {
      $log.debug('HomeController.setOrderProperty(' + property + ')');
      if (this.orderProperty === property) {
        this.orderProperty = '-' + property;
      } else if (this.orderProperty === '-' + property) {
        this.orderProperty = property;
      } else {
        this.orderProperty = property;
      }
    };
  }
};
