'use strict';

// !dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required
const { ROLES } = require('../constants');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

// Declare the Schema of the Mongo model
const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female']
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: Array,
            default: [],
        },
        status: {
            type: String,
            enum: ['active', 'banned'],
            default: 'active',
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: [ROLES.Admin, ROLES.User, ROLES.Baker],
            default: ROLES.User
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
