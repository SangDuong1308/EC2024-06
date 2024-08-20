const express = require('express');
const { asyncHandler } = require('../../utils/errorHandle');
const CategoryController = require('../../controllers/category.controller');
const { verifyRole, authentication } = require('../../utils/auth');
const { ROLES } = require('../../constants');

const router = express.Router();

router.get('/', asyncHandler(CategoryController.getAllCategories));
router.get('/:categoryId', asyncHandler(CategoryController.getCategoryById));

router.use(authentication);
router.post('/', verifyRole(ROLES.Admin), asyncHandler(CategoryController.addCategory))
router.delete('/:categoryId', verifyRole(ROLES.Admin), asyncHandler(CategoryController.deleteCategory))
router.patch('/:categoryId', verifyRole(ROLES.Admin), asyncHandler(CategoryController.updateCategory))

module.exports = router;
