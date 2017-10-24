'use strict';

module.exports = function(app) {
  app.controller('StatsController', ['$log', '$http', '$rootScope', StatsController]);

  function StatsController($log, $http) {
    this.getPlayers = function() {
      $log.debug('StatsController.getPlayers');
      $http.get(this.baseUrl + '/players', this.config)
        .then((res) => {
          this.players = res.data;
          this.players.forEach((player) => {
            player.show = true;
          });
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
        }, (err) => {
          $log.error('error', err);
        });
    };
  }
};
