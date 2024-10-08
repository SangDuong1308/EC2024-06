'use strict';

const bcrypt = require("bcrypt");
const AccessService = require('../services/access.service');

const { OK, CREATED, SuccessResponse } = require('../constants/success.response');
const { BadRequest } = require('../constants/error.reponse');
const User = require("../models/user.model");

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register successfully!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    };
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: await AccessService.login(req.body)
        }).send(res)
    };
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    };
}

module.exports = new AccessController();
