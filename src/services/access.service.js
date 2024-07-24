'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userModel = require('../models/user.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ForbiddenRequestError } = require('../core/reponse/error.reponse');
const keytokenModel = require('../models/keytoken.model');

const roles = {
    USER: 'user',
    ADMIN: 'admin',
    KITCHEN: 'kitchen',
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const holderUser = await userModel.findOne({ email }).lean();

        if (holderUser) {
            throw new ForbiddenRequestError('Error: User already exists!');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
            roles: roles.USER,
        });
        if (newUser) {
            // create private, public key
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            });
            console.log({ privateKey, publicKey });
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
            });

            if (!publicKeyString) {
                return {
                    code: 'xxxx',
                    message: 'publicKeyString error',
                };
            }

            console.log(`publicKeyString::`, publicKeyString);
            const publicKeyObject = crypto.createPublicKey(publicKeyString);

            console.log(`publicKeyObject::`, publicKeyObject);

            // create token pair
            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKeyObject, privateKey);

            console.log(`Create token success:: `, tokens); 

            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ['_id', 'name', 'email', 'roles'],
                        object: newUser,
                    }),
                    tokens,
                },
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    };
}

module.exports = AccessService;
