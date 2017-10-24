'use strict';

module.exports = function(app) {
  app.controller('PlayerPageController', ['$log', '$http', '$scope', PlayerPageController]);

  function PlayerPageController($log, $http, $scope) {
    this.players = $scope.players;
    this.player = $scope.player;
    this.totals = true;
    this.averages = false;
    this.orderProperty = 'name';
    this.opponents = [];

    this.init = function() {
      this.opponents = this.players.filter((player) => {
        return player.name !== this.player.name;
      }).map((opponent) => {
        return {name: opponent.name, wins: [], losses: []};
      });
      this.opponents.forEach((opponent) => {
        opponent.games = this.player.games.filter((game) => {
          return game.loser.name === opponent.name || game.winner.name === opponent.name;
        });
        opponent.wins = opponent.games.filter((game)=> {
          return game.winner.name === this.player.name;
        }).length;
        opponent.losses = opponent.games.length - opponent.wins;
        opponent.pointsFor = opponent.games.reduce((acc, curr) => {
          if (curr.winner.name === this.player.name) {
            return acc + curr.winner.score;
          } else {
            return acc + curr.loser.score;
          }
        });
        opponent.pointsAgainst = opponent.games.reduce((acc, curr) => {
          if (curr.winner.name === this.player.name) {
            return acc + curr.loser.score;
          } else {
            return acc + curr.winner.score;
          }
        });
        opponent.pointDifferential = opponent.pointsFor - opponent.pointsAgainst;

        opponent.averageFor = opponent.pointsFor / opponent.games.length;
        opponent.averageAgainst = opponent.pointsAgainst / opponent.games.length;
        opponent.averageDiff = opponent.pointDifferential / opponent.games.length;
      });
      this.sortByLowest('name');
    };

    this.switchStats = function() {
      this.totals = !this.totals;
      this.averages = !this.averages;
    };

    this.setOrderProperty = function(property) {
      if (property === 'name') {
        property = '-name';
      } else if (property === '-name') {
        property = 'name';
      }
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
