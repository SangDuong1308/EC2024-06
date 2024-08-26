const userModel = require("../models/user.model");
const { getSelectData } = require("../utils");

module.exports = {
    async findByEmail({email}) {
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
    },
    async findById(userId, select = []) {
        return await userModel.findById(userId).select(getSelectData(select))
    }
}
