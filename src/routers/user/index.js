const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const { authentication, verifyRole } = require('../../utils/auth');
const userController = require('../../controllers/user.controller');
const { ROLES } = require('../../constants');
const router = express.Router();

router.use(authentication)
router.get('/search', verifyRole(ROLES.Admin), asyncHandler(userController.searchUser))
router.get('/', verifyRole(ROLES.Admin), asyncHandler(userController.getAllUser))
router.get('/me', asyncHandler(userController.getUserById))
router.patch('/', asyncHandler(userController.updateUser))

module.exports = router;