const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin-controller');

router.post('/', AdminController.addProduct);
router.put('/:id', AdminController.updateProduct);
router.post('/bulk', AdminController.bulkUploadProducts);

module.exports = router;
