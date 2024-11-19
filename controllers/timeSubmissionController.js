const {TimeSubmission, User, Branch, Role, DailyAllocation} = require('../models');
const path = require('path');
const fs = require('fs');


const submitWeeklyReport = async (req, res) => {
  const { client_id, week_start, allocations } = req.body;
  const { consultant_id } = req;

  try {
    let totalHours = 0;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Validate allocations
    allocations.forEach((day) => {
      const dailyTotal = day.client_facing_hours + day.non_client_facing_hours + day.other_task_hours;
      if (dailyTotal > 12) throw new Error(`${day.day_of_week} exceeds 12 hours.`);
      totalHours += dailyTotal;
    });
    if (totalHours > 40) throw new Error(`Total hours exceed 40 for the week.`);

    // Create a time submission record
    const timeSubmission = await TimeSubmission.create({ client_id, consultant_id, week_start, total_hours: totalHours });

    // Insert daily allocations
    await Promise.all(
      allocations.map((day) =>
        DailyAllocation.create({
          time_submission_id: timeSubmission.id,
          day_of_week: day.day_of_week,
          client_facing_hours: day.client_facing_hours,
          non_client_facing_hours: day.non_client_facing_hours,
          other_task_hours: day.other_task_hours,
        })
      )
    );

    res.status(201).json({ message: 'Weekly Report submitted successfully', timeSubmission });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const fetchWeeklyReport = async (req, res) => {
  try {
    const allTimeSubmission = await TimeSubmission.findAll({ order: 
    [['week_start', 'DESC']],
    include: [
          {
          model: DailyAllocation,
          attributes: [
            'day_of_week', 'client_facing_hours', 
            'non_client_facing_hours', 'other_task_hours'
          ], 
        },
        ]
    });
    res.status(200).json(allTimeSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchWeeklyReportByClientID = async (req, res) => {
  const client_id = parseInt(req.params.id);
  try {
    const reportByID = await TimeSubmission.findOne({where: {client_id}});
    if (reportByID) {
      res.status(200).json(reportByID);
    } else {
      res.status(404).json({ error: 'Weekly Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchWeeklyReportByConsultantID = async (req, res) => {
  const consultant_id = parseInt(req.params.id);
  try {
    const reportByID = await TimeSubmission.findOne({where: {consultant_id}});
    if (reportByID) {
      res.status(200).json(reportByID);
    } else {
      res.status(404).json({ error: 'Weekly Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWeeklyReport = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data } = req.body;
  try {
    const [updated] = await TimeSubmission.update({data }, { where: { id } });
    if (updated) {
      const updatedTimeSubmission = await TimeSubmission.findOne({ where: { id } });
      res.status(200).json(updatedTimeSubmission);
    } else {
      res.status(404).json({ error: 'Weekly Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteWeeklyReport = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await TimeSubmission.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: 'Weekly Time Submission deleted successfully' });
    } else {
      res.status(404).json({ error: 'Weekly Time Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const massDeleteWeeklyReports = async (req,res) => {
    const { ids } = req.body;
    try{
      await TimeSubmission.destroy({ where: { id: ids } });
    res.status(200).send({ message: 'Selected Weekly Time Submissions deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete selected Weekly Time Submissions' });
  }
  };
  
module.exports = {
  submitWeeklyReport,
  fetchWeeklyReport,
  fetchWeeklyReportByClientID,
  fetchWeeklyReportByConsultantID,
  updateWeeklyReport,
  deleteWeeklyReport,  
  massDeleteWeeklyReports
};
