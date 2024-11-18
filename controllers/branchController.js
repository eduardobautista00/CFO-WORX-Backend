const {Branch} = require('../models');

const getAllBranches = async (req, res) => {
    try {
        const allBranch = await Branch.findAll();
        res.status(200).json(allBranch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBranchById = async (req, res) => {
    const { id } = req.params;
    try {
        const branch = await Branch.findByPk(id);
        if (branch) {
            res.status(200).json(branch);
        } else {
            res.status(404).json({ error: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBranch = async (req, res) => {
    const { branch_name, branch_address, operating_hours, status } = req.body;
    try {
        const newBranch = await Branch.create({ branch_name, branch_address, operating_hours, status });
        res.status(201).json(newBranch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { branch_name, branch_address, operating_hours, status } = req.body;
    try {
        const [updated] = await Branch.update({ branch_name, branch_address, operating_hours, status }, { where: { id } });
        if (updated) {
            const updatedBranch = await Branch.findByPk(id);
            res.status(200).json(updatedBranch);
        } else {
            res.status(404).json({ error: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBranch = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Branch.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Branch deleted' });
        } else {
            res.status(404).json({ error: 'Branch not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};

