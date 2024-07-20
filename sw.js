importScripts('/js/sw-toolbox.js');

toolbox.precache([
  'index.html',

  'css/material-theme/colors.module.css',
  'css/material-theme/theme.css',
  'css/material-theme/theme.dark.css',
  'css/material-theme/theme.light.css',
  'css/material-theme/tokens.css',
  'css/material-theme/typography.module.css',
  'css/datalab.min.css',
  'css/common.css',
  'css/home.css',
  'css/tuning.css',
  'css/rawdata.css',

  'js/bluetooth.js',
  'js/common.js',
  'js/home.js',
  'js/tuning.js',
  'js/rawdata.js',
  'js/chart.js',
]);

toolbox.router.default = toolbox.networkFirst;
toolbox.options.networkTimeoutSeconds = 5;

toolbox.router.get('icons/*', toolbox.fastest);