'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('./checkAuth');
const { BadRequest, AuthFailureError } = require('../constants/error.reponse');
const { findByUserId } = require('../services/keyToken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access Token
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days',
        });

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode verify::`, decoded);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers['x-client-id'];

    if (!userId) {
        throw new AuthFailureError('Missing required arguments!');
    }

    const accessToken = req.headers["x-authorization"];
    if (!accessToken) {
        throw new AuthFailureError('No token provided!');
    }

    const keyStore = await findByUserId(userId);
    if (!keyStore) {
        throw new AuthFailureError('KeyStore not found!');
    }

    try {

    } catch(error) {
        throw error
    }
    JWT.verify(accessToken, keyStore.publicKey, (err, decodedUser) => {
        if (err) {
            throw new AuthFailureError('Invalid access token.');
        } else {
            req.keyStore = keyStore;
            req.user = decodedUser;
        }
    });
    return next();
});

module.exports = { createTokenPair, authentication };
