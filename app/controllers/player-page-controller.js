'use strict';

module.exports = function(app) {
  app.controller('PlayerPageController', ['$log', PlayerPageController]);

  function PlayerPageController($log) {
    this.opponents = [];
    this.tableSrc = require('../assets/table-side-view-wider.png');

    this.init = function() {
      $log.debug('PlayerPageController.init');
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
        if (opponent.games.length > 0) {
          opponent.pointDifferential = opponent.pointsFor - opponent.pointsAgainst;
          opponent.averageFor = parseFloat(opponent.pointsFor / opponent.games.length).toFixed(1);
          opponent.averageAgainst = parseFloat(opponent.pointsAgainst / opponent.games.length).toFixed(1);
          opponent.averageDiff = parseFloat(opponent.pointDifferential / opponent.games.length).toFixed(1);
          if (opponent.pointDifferential >= 0) {
            opponent.diffDisplay = '+' + opponent.pointDifferential;
          } else {
            opponent.diffDisplay = opponent.pointDifferential;
          }
          opponent.percentage = parseFloat(opponent.wins / opponent.games.length).toFixed(3);
        } else {
          opponent.pointDifferential = 0;
          opponent.averageFor = parseFloat(0).toFixed(1);
          opponent.averageAgainst = parseFloat(0).toFixed(1);
          opponent.averageDiff = parseFloat(0).toFixed(1);
          opponent.diffDisplay = '+' + 0;
          opponent.percentage = parseFloat(0).toFixed(3);
        }
      });
      this.opponents = this.opponents.filter((opponent) => {
        return opponent.games.length > 0;
      });
    };
  }
};
