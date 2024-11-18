const {UserBranch} = require('../models');

const getUsersByBranch = async (req, res) => {
    try {
        const allUsersByBranch = await UserBranch.findAll();
        res.status(200).json(allUsersByBranch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  const createUserinBranch = async (req, res) => {
    const { user_id, branch_id } = req.body;
    try {
        const newUserinBranch = await UserBranch.create({ user_id, branch_id });
        res.status(201).json({ message: `User ${newUserinBranch.user_id} assigned with Branch ${newUserinBranch.branch_id} successfully` });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'Invalid user_id or branch_id provided.' });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'This combination already exists.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

const deleteUserByBranch = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await UserBranch.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'User removed from branch' });
        } else {
            res.status(404).json({ error: 'Cannot complete action' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getUsersByBranch,
    createUserinBranch,
    deleteUserByBranch,
};

