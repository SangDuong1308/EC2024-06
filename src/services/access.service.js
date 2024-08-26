const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userModel = require('../models/user.model');
const KeyTokenService = require('./keyToken.service');
const { getInfoData } = require('../utils');
const keytokenModel = require('../models/keytoken.model');
const { ForbiddenRequest, BadRequest, InternalServerError } = require('../constants/error.reponse');
const { findByEmail } = require('./user.service');
const { error } = require('console');
const { Types } = require('mongoose');
const { ROLES } = require('../constants');

class AccessService {

    static signUp = async ({ name, email, password }) => {
        const holderUser = await userModel.findOne({ email }).lean();

        if (holderUser) {
            throw new ForbiddenRequest('Error: User already exists!');
            // throw new ForbiddenRequest();
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash
        });
        if (newUser) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");

            console.log({ privateKey, publicKey });

            // create token pair
            const tokens = await KeyTokenService.createTokenPair({ userId: newUser._id, email }, publicKey, privateKey);

            console.log(`Create token success:: `, tokens);

            return {
                code: 201,
                user: getInfoData({
                        fields: ['_id', 'name', 'email', 'role'],
                        object: newUser,
                    }),
                tokens,
            };
        }
        return {
            code: 200,
            metadata: null,
        };
    };

    static login = async ({ email, password}) => {
        if (!email || !password) {
            throw new BadRequest("Missing information!")
        }
        const foundUser = await findByEmail({email})
        if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
            throw new ForbiddenRequest('Invalid Credential');
        }

        console.log(foundUser);

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");
        
        const tokens = await KeyTokenService.createTokenPair(
            {
                userId: foundUser._id, 
                email: foundUser.email,
                role: foundUser.role
            },
            publicKey, 
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            publicKey: publicKey,
            privateKey: privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            user: getInfoData({
                fields: ['_id', 'name', 'email', 'role'],
                object: foundUser,
            }),
            tokens,
        }
    }

    static logout = async ( keyStore ) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({ delKey });
        return delKey;
    }
}

module.exports = AccessService;
