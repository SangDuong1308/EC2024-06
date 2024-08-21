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
}

module.exports = {
    getInfoData,
    getSelectData,
    unSelectData,
    deleteFileByRelativePath,
    removeExtInFileName
};
