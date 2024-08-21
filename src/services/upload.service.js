const cloudinary = require("../configs/config.cloudinary");

module.exports = {
    async uploadFileFromLocal(path, filename, folderName) {
        const result = await cloudinary.uploader.upload(path, {
            folder: folderName,
            public_id: filename,
        });

        return {
            image_url: result.secure_url,
        };
    },

    async uploadFileFromUrl() {},
}