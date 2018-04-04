module.exports = {
  /**
   * Application configuration for viewn-vidfs
   * This runs it in 'cluster' mode, using all but one CPU
   */
  apps : [{
    name          : 'viewn-vidfs',
    script        : './bin/www',
    instances     : -1,
    exec_mode     : 'cluster',
    env : {
      'PORT' : 3001
    }
  }]
};
