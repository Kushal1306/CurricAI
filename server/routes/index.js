const express = require('express');
const reportRoute = require('./ReportRoutes.js');

const mainRouter = express.Router();

mainRouter.use('/user', reportRoute);

module.exports = mainRouter;
