'use strict';

module.exports = (app) => {
  require('./home-controller')(app);
  require('./stats-controller')(app);
  require('./player-page-controller')(app);
  require('./update-controller')(app);
};
