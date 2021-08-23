const componentPlopConfig = require('./generators/component');

module.exports = (plop) => {
  plop.setGenerator('component', componentPlopConfig);
};
