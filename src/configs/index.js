const _ = require('lodash');
const fs = require('fs');
const { argv } = require('yargs');

const settings = require('./settings');

const userSettings = () => {
  if (argv.config) {
    try {
      const data = fs.readFileSync(argv.config).toString();
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  }
  return {};
};

const configs = _.merge(settings, userSettings());

module.exports = configs;
