const cloudinary = require("../configs/config.cloudinary");
const { InternalServerError } = require("../constants/error.reponse");
const { removeNestedNullUndefined, deleteFileByRelativePath } = require("../utils");

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

    async uploadFileFromLocalWithMulter(
        file,
        folder = process.env.CLOUDINARY_USER_COMMENT_PATH
    ) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
                public_id: removeNestedNullUndefined(file.filename),
            });

            if (!result.secure_url) {
                deleteFileByRelativePath(file.path);
                throw new InternalServerError("Cant update image to cloud");
            }
            return result.secure_url;
        } catch (err) {
            deleteFileByRelativePath(file.path);
            throw new InternalServerError(err.message);
        }
    },

    async uploadFileFromUrl() {},
}