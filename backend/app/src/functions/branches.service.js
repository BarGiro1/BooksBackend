const Branch = require('../models/BranchSchema'); 

const createBranch = async (branchData) => {
    try {
        const newBranch = new Branch(branchData);
        return await newBranch.save();
    } catch (error) {
        throw new Error('Error creating branch: ' + error.message);
    }
};

const getAllBranches = async () => {
    try {
        return await Branch.find({});
    } catch (error) {
        throw new Error('Error fetching branches: ' + error.message);
    }
};

const getBranchById = async (branchId) => {
    try {
        return await Branch.findById(branchId);
    } catch (error) {
        throw new Error('Branch not found: ' + error.message);
    }
};

const updateBranch = async (branchId, updateData) => {
    try {
        return await Branch.findByIdAndUpdate(branchId, updateData, { new: true });
    } catch (error) {
        throw new Error('Error updating branch: ' + error.message);
    }
};

const deleteBranch = async (branchId) => {
    try {
        return await Branch.findByIdAndDelete(branchId);
    } catch (error) {
        throw new Error('Error deleting branch: ' + error.message);
    }
};

module.exports = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch
};
