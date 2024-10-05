const branchService = require('../functions/branches.service');

// Create a new branch
const createBranch = async (req, res) => {
    try {
        const newBranch = await branchService.createBranch(req.body);
        res.status(201).json(newBranch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all branches
const getAllBranches = async (req, res) => { // Ensure this matches your route
    try {
        const branches = await branchService.getAllBranches();
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all branches
const getBranches = async (req, res) => {
    try {
        const branches = await branchService.getAllBranches();
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a branch by ID
const getBranchById = async (req, res) => {
    try {
        const branch = await branchService.getBranchById(req.params.id);
        if (!branch) return res.status(404).json({ message: 'Branch not found' });
        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a branch by ID
const updateBranch = async (req, res) => {
    try {
        const updatedBranch = await branchService.updateBranch(req.params.id, req.body);
        if (!updatedBranch) return res.status(404).json({ message: 'Branch not found' });
        res.status(200).json(updatedBranch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a branch by ID
const deleteBranch = async (req, res) => {
    try {
        const deletedBranch = await branchService.deleteBranch(req.params.id);
        if (!deletedBranch) return res.status(404).json({ message: 'Branch not found' });
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export the controller functions
module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
    getAllBranches
};
