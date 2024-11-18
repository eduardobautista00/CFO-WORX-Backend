'use strict';
const { StaffLog, User, Role, Branch } = require('../models'); 

const getAllStaffLogs = async (req, res) => {
  try {
    const staffLogs = await StaffLog.findAll({
      include: [
        { model: User, attributes: ['first_name', 'sex', 'last_name'],
          include:[
            {
              model:Role,
              attributes:['role_name']
            },
            {
              model:Branch,
              attributes:['branch_name']
            },
          ]
         },
      ], 
      order: [['createdAt', 'DESC']], 
    });
    res.status(200).json(staffLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  const deleteStaffLog = async (req, res) => {
    const { id } = req.params;
    try{
      await StaffLog.destroy({ where: { id } });
    res.status(200).send({ message: 'Log deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete log' });
  }
  };

  const massDeleteLogs = async (req,res) => {
    const { ids } = req.body;
    try{
      await StaffLog.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'Selected logs deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete selected logs' });
  }
  };

module.exports = {
  getAllStaffLogs,
  deleteStaffLog,
  massDeleteLogs
};