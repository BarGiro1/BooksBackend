const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branches.controller');

router.post('/', branchController.createBranch);
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
