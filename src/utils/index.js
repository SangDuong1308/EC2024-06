'use strict';

const _ = require('lodash');
const fs = require('fs');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map((field) => [field, 0]));
}

const deleteFileByRelativePath = (filePath) => {
    if (!filePath) return;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File does not exist or cannot be accessed");
            return;
        }

        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return;
            }

            console.log("File deleted successfully");
        });
    });
};

const removeExtInFileName = (filename) => {
    let split = filename.split(".");
    let ext = split.at(-1);
    return filename.replaceAll(`.${ext}`, "");
};

const removeNestedNullUndefined = (obj) => {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) delete obj[key];
        else if (typeof obj[key] === "object") {
            removeNestedNullUndefined(obj[key]);
        }
    }
};

function distanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in kilometers

    const latDistance = toRadians(lat2 - lat1);
    const lonDistance = toRadians(lon2 - lon1);
    const a =
        Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(lonDistance / 2) *
            Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2);
}

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

function findShippingFee(distance) {
    if (distance < 2) return 16000;
    else if (distance < 6) return 20000;
    else if (distance < 8) return 22000;
    else if (distance < 12) return 28000;
    else if (distance < 20) return 40000;
    else return 48000;
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    deleteFileByRelativePath,
    removeExtInFileName,
    distanceBetweenTwoPoints,
    findShippingFee,
    removeNestedNullUndefined
};
