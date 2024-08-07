'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');
const JWT = require('jsonwebtoken');

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            };
            const options = { upsert: true, new: true };

            const token = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static createTokenPair = async (payload, publicKey, privateKey) => {
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

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

}

module.exports = KeyTokenService;
