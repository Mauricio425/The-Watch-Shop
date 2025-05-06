const express       = require('express');
const multer        = require('multer');
const AdminController = require('../controllers/admin-controller');
const router        = express.Router();

const upload = multer({ dest: 'tmp/' });

router.get('/',                AdminController.getAllProductsAdmin);

router.get('/:id',             AdminController.getProductByIdAdmin);

router.post('/',               AdminController.addProduct);

router.put('/:id',             AdminController.updateProduct);

router.delete('/:id',          AdminController.deactivateProduct);

router.put('/:id/relist',      AdminController.activateProduct);

router.post(
  '/bulk',
  upload.single('fileUpload'),
  AdminController.bulkUploadProducts
);

module.exports = router;
