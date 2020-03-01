const environment = 'development';

const config = require('../knexjfile');

const environmentConfig = config[environment];

const knex = require('knex');

const connection = knex(environmentConfig);

module.exports = connection;