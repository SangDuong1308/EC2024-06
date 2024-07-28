const userModel = require("../models/user.model");

const findByEmail = async ({email}) => {
    try {
        return await userModel.findOne({ email }).select({
            email: 1,
            password: 1,
            name: 1,
            status: 1,
            role: 1
        }).lean();
    } catch (error) {
        console.error(`error::`, error);
        throw error;
    }
}


module.exports = {findByEmail};