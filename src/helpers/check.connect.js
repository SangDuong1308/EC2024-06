'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// Count Conenct
const countConnect = () => {
    const numConenction = mongoose.connections.length;
    console.log(`Number of connections: ${numConenction}`);
    return numConenction;
};

//Check over load
const checkOverload = () => {
    setInterval(() => {
        const numConenction = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example of maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connection: ${numConenction}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConenction > maxConnections) {
            console.log(`Connection overloaded`);
        }
    }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
    countConnect,
    checkOverload,
};
