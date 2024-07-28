'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

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

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

}

module.exports = KeyTokenService;
