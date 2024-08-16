const { InternalServerError, BadRequest, Api404Error } = require("../constants/error.reponse")
const userModel = require("../models/user.model")

module.exports = {
    async getAllUser(req, res, next) {
        try {
            const users = await userModel.find()

            if (!users) {
                throw new Error('Users not found!')
            }

            return res.status(200).json({
                message: 'Success!',
                metadata: users
            })
        } catch (error) {
            next(new InternalServerError(error.message));
        }
    },
    async searchUser(req, res, next) {
        try {
            const { name } = req.query;

            const regex = new RegExp(name, 'i');

            const users = await userModel.find(
            {
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } }
                ]
            },
            { password: 0, _id: 0 });

            res.status(200).json({
                users
            });
        } catch (error) {
            next(new InternalServerError(error.message));
        }
    },
    async getUserById(req, res, next) {
        try {
            const { userId } = req.user;

            if (!userId) {
                throw new Error('Missing required arguments');
            }

            const user = await userModel.findById(userId, { password: 0 });

            if (!user) {
                throw new Error('User not found!');
            }

            return res.status(200).json({
                message: 'Success!',
                metadata: user
            });
        } catch (error) {
            next(new InternalServerError(error.message));
        }
    },
    async updateUser(req, res, next) {
        try {
            const { userId } = req.user;
            let updatedUser = req.body;
            console.log(updatedUser);

            if (!userId || !updatedUser)
                throw new BadRequest("Missing some information in body");
            const result = await userModel.updateOne(
                { _id: userId },
                { $set: { ...updatedUser } }
            );

            if (result.modifiedCount === 0) throw new Api404Error("User not found");

            res.status(200).json({
                message: "User successfully updated",
            });
        } catch(error) {
            next(new InternalServerError(error.message));
        }
    }
}