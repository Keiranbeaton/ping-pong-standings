'use strict';

module.exports = function(app) {
  app.controller('HomeController', ['$log', '$http', '$rootScope', HomeController]);

  function HomeController($log, $http, $rootScope) {
    this.getPlayers = function() {
      $log.debug('HomeController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
          this.players.forEach((player) => {
            player.percentage = player.wins / player.games.length;
            player.differential = player.pointsFor - player.pointsAgainst;
          });

        });
    };
  }
};
