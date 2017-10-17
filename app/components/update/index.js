'use strict';

module.exports = (app) => {
  app.component('kbUpdate', {
    controller: 'UpdateController',
    template: require('./update-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
