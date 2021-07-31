const express = require('express');
const smsRoute = require('./sms.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/sms',
    route: smsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/sms',
    route: smsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
