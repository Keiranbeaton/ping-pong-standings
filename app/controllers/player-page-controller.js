'use strict';

module.exports = function(app) {
  app.controller('PlayerPageController', ['$log', '$http', '$scope', PlayerPageController]);

  function PlayerPageController($log, $http, $scope) {
    this.totals = true;
    this.averages = false;
    this.orderProperty = '-percentage';
    this.opponents = [];

    this.init = function() {
      $log.debug('PlayerPageController.init');
      $log.log('scope', $scope);
      $log.log('this', this);
      this.opponents = this.playerArray.filter((player) => {
        return player.name !== this.player.name;
      }).map((opponent) => {
        return {name: opponent.name, games: [], wins: 0, losses: 0};
      });
      this.opponents.forEach((opponent) => {
        opponent.games = this.player.games.filter((game) => {
          return game.loser.name === opponent.name || game.winner.name === opponent.name;
        });
        opponent.winsArray = opponent.games.filter((game)=> {
          return game.winner.name === this.player.name;
        });
        opponent.lossesArray = opponent.games.filter((game) => {
          return game.loser.name === this.player.name;
        });
        opponent.wins = opponent.winsArray.length;
        opponent.losses = opponent.lossesArray.length;
        opponent.pointsFor = opponent.games.map((game) => {
          if (game.winner.name === this.player.name) {
            return game.winner.score;
          } else {
            return game.loser.score;
          }
        }).reduce((acc, curr) => {
          return acc + curr;
        }, 0);
        opponent.pointsAgainst = opponent.games.map((game) => {
          if (game.winner.name === this.player.name) {
            return game.loser.score;
          } else {
            return game.winner.score;
          }
        }).reduce((acc, curr) => {
          return acc + curr;
        }, 0);
        $log.log('pointsFor', opponent.pointsFor);
        $log.log('pointsAgainst', opponent.pointsAgainst);
        opponent.pointDifferential = opponent.pointsFor - opponent.pointsAgainst;
        opponent.averageFor = opponent.pointsFor / opponent.games.length;
        opponent.averageAgainst = opponent.pointsAgainst / opponent.games.length;
        opponent.averageDiff = parseFloat(opponent.pointDifferential / opponent.games.length).toFixed(1);
        if (opponent.pointDifferential >= 0) {
          opponent.diffDisplay = '+' + opponent.pointDifferential;
        } else {
          opponent.diffDisplay = opponent.pointDifferential;
        }
        opponent.percentage = parseFloat(opponent.wins / opponent.games.length).toFixed(3);
      });
    };

    this.switchTotals = function() {
      this.totals = true;
      this.averages = false;
    };

    this.switchAverages = function() {
      this.averages = true;
      this.totals = false;
    };

    this.setOrderProperty = function(property) {
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
