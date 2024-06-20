'use strict';

// !dmbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

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
        },
        phoneNumber: {
            type: String,
        },
        address: {
            type: String,
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
        roles: {
            type: String,
            enum: ['user', 'admin', 'kitchen'],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
