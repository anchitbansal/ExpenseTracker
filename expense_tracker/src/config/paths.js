const path = require('path');

global.PATHS= {
  root: path.resolve(__dirname, '../'),
  configs: path.resolve(__dirname, './'),
  utils: path.resolve(__dirname, '../utils'),
  middlewares: path.resolve(__dirname, '../middlewares'),
  module: path.resolve(__dirname, '../modules'),
  logger: path.resolve(__dirname, '../../logger'),
  public: path.resolve(__dirname, '../public'),
  view: path.resolve(__dirname, '../view'),
  files: path.resolve(__dirname, '../../files'),
};
