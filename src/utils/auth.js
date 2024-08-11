'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('./errorHandle');
const { BadRequest, AuthFailureError, Api404Error } = require('../constants/error.reponse');
const KeyTokenService = require('../services/keyToken.service');
const { findByUserId, removeKeyById } = require('../services/keyToken.service')
const keytokenModel = require('../models/keytoken.model');

const authentication = async (req, res, next) => {
    const userId = req.headers['x-client-id'];

    if (!userId) {
        throw new AuthFailureError('Missing required arguments!');
    }

    const accessToken = req.headers['x-authorization'];
    if (!accessToken) {
        throw new AuthFailureError('No token provided!');
    }

    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new AuthFailureError('KeyStore not found!');
    }

    JWT.verify(accessToken, keyStore.publicKey, (err, decodedUser) => {
        if (err) {
            throw new AuthFailureError('Invalid access token.');
            // console.error('Invalid access token.', err);
        } else {
            req.keyStore = keyStore;
            req.user = decodedUser;
        }
    });
    return next();
};

const handleRefreshToken = async (req, res, next) => {
    const userId = req.headers['x-client-id'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!userId || !refreshToken) {
        throw new AuthFailureError('Missing refresh token!');
    }

    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new Api404Error('KeyStore not found!');
    }

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        await removeKeyById(keyStore._id);
        throw new AuthFailureError('Refresh token has been used!');
    }

    if (keyStore.refreshToken !== refreshToken)
        throw new AuthFailureError("Invalid refresh token");


    let email;

    JWT.verify(refreshToken, keyStore.privateKey, (err, decodedUser) => {
        if (err) {
            console.error('Invalid refresh token.', err);
            throw new AuthFailureError('Invalid refresh token.');
        } else {
            email = decodedUser.email;
        }
    });

    const newTokens = await KeyTokenService.createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey);

    await keytokenModel.findByIdAndUpdate(
        keyStore._id,
        {
            refreshToken: newTokens.refreshToken,
            $push: { refreshTokensUsed: keyStore.refreshToken },
        },
        { new: true }
    );

    // return newTokens;
    res.status(200).json(newTokens);
}

const verifyRole = (...roles) => async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AuthFailureError("Unauthorized: No user information available."));
        }

        const hasRole = roles.includes(req.user.role);
        if (!hasRole) {
            return next(
                new AuthFailureError(`Authenticate Failure: Your role is ${req.user.role}. Required roles: ${roles.join(", ")}.`)
            );
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = { authentication, handleRefreshToken, verifyRole };
