'use strict';

module.exports = (app) => {
  app.component('kbStats', {
    controller: 'StatsController',
    template: require('./stats-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
