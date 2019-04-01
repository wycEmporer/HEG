const buildFileConfig = require('configDir/build-file.config');
const moduleExports = {
  DIRS: {BUILD_FILE: buildFileConfig, },

  PAGE_ROOT_PATH: '../../',
};
/* help in ie CORS delegate */
moduleExports.DIRS.SERVER_API_URL = moduleExports.SERVER_API_URL;

/* global IS_PRODUCTION:true */ 
// need global  to declare  IS_PRODUCTION is global variable ,to ESlint 

if (process.env.NODE_ENV === 'production') { 
  // production
  // moduleExports.API_ROOT = 'http://192.168.1.134:8080/';
  moduleExports.API_ROOT = '/';
} else {
  //develop
  // moduleExports.API_ROOT = '/';
  // moduleExports.API_ROOT = 'http://192.168.1.134:8081/';
  moduleExports.API_ROOT = '/';
}
module.exports = moduleExports;
