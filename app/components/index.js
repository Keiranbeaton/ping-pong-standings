'use strict';

module.exports = (app) => {
  require('./home')(app);
  require('./player-page')(app);
  require('./stats')(app);
  require('./update')(app);
};
