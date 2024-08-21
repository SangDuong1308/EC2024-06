const express = require('express');
const { authentication, verifyRole } = require('../../utils/auth');
const { ROLES } = require('../../constants');
const { upload } = require('../../configs/config.multer');
const { asyncHandler } = require('../../utils/errorHandle');
const adminController = require('../../controllers/admin.controller');
const router = express.Router();

router.use(authentication, verifyRole(ROLES.Admin))
router.post('/add', upload.single('product_thumb'), asyncHandler(adminController.createPoruduct))
router.patch('/update', upload.single('product_thumb'), asyncHandler(adminController.updateProduct))

module.exports = router;