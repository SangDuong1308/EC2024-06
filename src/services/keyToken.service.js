'use strict';

const keytokenModel = require('../models/keytoken.model');

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
}

module.exports = KeyTokenService;
