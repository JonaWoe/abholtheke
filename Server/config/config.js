// requires
const _ = require('lodash');

// module variables
const config = require('./config.json');
const defaultConfig = config.cloud;
const environment = process.env.NODE_ENV || 'cloud';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// log global.gConfig
console.log('Load config profile: ' + environment);
