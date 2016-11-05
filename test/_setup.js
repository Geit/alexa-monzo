const translator = require('../translator');
// Dirty dirty hack to make tests pass when using random strings.
translator.random = function () {
  return 0;
};
