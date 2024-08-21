'use strict';

const express = require('express');
const router = express.Router();

/**
   * @openapi
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
*/
router.get('/healthcheck', (req, res) => res.sendStatus(200))
router.use('/auth', require('./access'));
router.use('/user', require('./user'));
router.use('/admin', require('./admin'));
router.use('/category', require('./category'));
router.use('/product', require('./product'));
// handle error for rq do not match any route 
router.use('/', (req, res) => res.status(404).json('No API route found'));

module.exports = router;
