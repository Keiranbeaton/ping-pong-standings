'use strict';

module.exports = (app) => {
  app.component('kbPlayerPage', {
    controller: 'PlayerPageController',
    template: require('./player-page-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
