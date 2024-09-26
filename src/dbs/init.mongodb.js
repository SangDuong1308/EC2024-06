'use strict';

const mongoose = require('mongoose');

const {
    db: { host, port, name },
} = require('../configs/config.mongodb');

// For local connection
// const connectString = `${host}:${port}/${name}`;
const connectString = `${host}/${name}?retryWrites=true&w=majority&appName=metrics`;

const { countConnect } = require('../helpers/check.connect');

console.log(`connectString:: ${connectString}`);

class Database {
    constructor() {
        this.connect();
    }

    //connect
    connect(type = 'mongodb') {
        // dev
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose
            .connect(connectString)
            .then((_) => {
                console.log(`Connected Mongodb Successfully`, countConnect());
            })
            .catch((err) => console.log(`Error connect Mongodb: ${err}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
