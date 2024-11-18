const {TimeSubmission, User, Branch, Role} = require('../models');
const path = require('path');
const fs = require('fs');


const createTimeSubmission = async (req, res) => {
  const { data } = req.body;
  const { user } = req;

  try {
    // Fetch the user's Branch through the join table
    const userWithBranch = await User.findByPk(user.id, {
      include: [{ model: Branch }]
    });

    if (!userWithBranch.Branch || userWithBranch.Branch.length === 0) {
      return res.status(400).json({ error: 'User is not assigned to any branch.' });
    }

    // You can choose which branch to assign here, e.g., the first one
    const branch_id = userWithBranch.Branch[0].id; // or any logic to choose the branch
  
    
    const newTimeSubmission = await TimeSubmission.create({
      data,
      user_id: user.id,
    });

    res.status(201).json({ message: `TimeSubmission created with ID ${newTimeSubmission.id}` });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'TimeSubmission already exists.' });
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      res.status(400).json({ error: 'Invalid data provided.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};


const getTimeSubmission = async (req, res) => {
  try {
    const allTimeSubmission = await TimeSubmission.findAll({ order: 
    [['createdAt', 'ASC']],
    include: [
          {
          model: User,
          include: [
            {
              model: Role,
              attributes: ['role_name'], // Include the role name from Role
            },
          ],
          attributes: ['first_name', 'sex', 'last_name'], // Include user attributes
        },
            
        ]
    });
    res.status(200).json(allTimeSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimeSubmissionByCode = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const TimeSubmission = await TimeSubmission.findByPk(id);
    if (TimeSubmission) {
      res.status(200).json(TimeSubmission);
    } else {
      res.status(404).json({ error: 'Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTimeSubmission = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data } = req.body;
  try {
    const [updated] = await TimeSubmission.update({data }, { where: { id } });
    if (updated) {
      const updatedTimeSubmission = await TimeSubmission.findOne({ where: { id } });
      res.status(200).json(updatedTimeSubmission);
    } else {
      res.status(404).json({ error: 'Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTimeSubmission = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await TimeSubmission.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Time Submission deleted successfully' });
    } else {
      res.status(404).json({ error: 'Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const massDeleteTimeSubmission = async (req,res) => {
    const { ids } = req.body;
    try{
      await TimeSubmission.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'Selected Time Submission deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete selected Time Submission' });
  }
  };
  
module.exports = {
  createTimeSubmission,
  getTimeSubmission,
  getTimeSubmissionByCode,
  updateTimeSubmission,
  deleteTimeSubmission,
  massDeleteTimeSubmission
};
