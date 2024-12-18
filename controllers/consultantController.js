const {Client, Consultant, User, TimeSubmission, ClientConsultant} = require('../models');
const sequelize = require('sequelize');

const getConsultants = async (req, res) => {
    try {
      const allConsultant = await Consultant.findAll({
        order: [['id', 'ASC']],
        include: [
          {
            model: User,
            attributes: ['first_name', 'last_name', 'email'] 
          }
        ],
        attributes: ['title', 'salary_per_hour', 'bill_rate']
      });
      res.status(200).json(allConsultant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
const getConsultantswithClient = async (req, res) => {
  try {
    const allConsultant = await Consultant.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'email']
        },

        {
          model: Client,
          through: { attributes: [] },
          attributes: ['name', 'client_code', 'services', 'utilization_target', 'revenue'] 
        }
      ]
    });
    res.status(200).json(allConsultant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  
   const getConsultantById = async (req, res) => {
    try {
      const ConsultantId = req.params.id;
      const Consultant = await Consultant.findByPk(ConsultantId, {
        include: [
            {
              model: Client,
              include: [
                  {
                      model: User,
                      attributes: ['first_name', 'last_name']
                  }
  
              ],
              attributes: ['client_code'] // Exclude join table attributes
            }
          ]
      });
  
      if (!Consultant) {
        return res.status(404).json({ error: 'Consultant not found' });
      }
  
      res.status(200).json(Consultant);
    } catch (error) {
      console.error('Error fetching Consultant details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const createConsultant = async (req, res) => {
    const { title, salary_per_hour, bill_rate} = req.body;
    try {
      const newConsultant = await Consultant.create({ title, salary_per_hour, bill_rate, });
      res.status(201).json({ message: `Consultant added with ID: ${newConsultant.id}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateConsultant = async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, salary_per_hour, bill_rate  } = req.body;
    try {
      const [updated] = await Consultant.update({ title, salary_per_hour, bill_rate  }, { where: { id } });
      if (updated) {
        const updatedConsultant = await Consultant.findByPk(id);
        res.status(200).json(updatedConsultant);
      } else {
        res.status(404).json({ error: 'Consultant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteConsultant = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const deleted = await Consultant.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: `Consultant deleted with ID: ${id}` });
      } else {
        res.status(404).json({ error: 'Consultant not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const utilizationReport = async (req, res) => {
    const { consultant_id, period, client_type, min_hours, max_hours } = req.query;
  
    try {
      // Build dynamic filters
      const consultantFilter = consultant_id ? { id: consultant_id } : {};
      const clientTypeFilter = client_type ? { service: client_type } : {};
      const activityFilter = {};
      if (min_hours || max_hours) {
        activityFilter.total_hours = {};
        if (min_hours) activityFilter.total_hours[sequelize.Op.gte] = min_hours;
        if (max_hours) activityFilter.total_hours[sequelize.Op.lte] = max_hours;
      }
  
      // Query consultants and their associated data
      const consultants = await Consultant.findAll({
        where: consultantFilter,
        include: [
          {
            model: TimeSubmission,
            where: activityFilter,
            include: [
              {
                model: Client,
                where: clientTypeFilter,
                attributes: ['name', 'client_code', 'services', 'utilization_target']
              }
            ],
            attributes: [
              [sequelize.fn('SUM', sequelize.col('total_hours')), 'total_hours'],
              [sequelize.fn('DATE_FORMAT', sequelize.col('week_start'), getPeriodFormat(period)), 'period']
            ],
            group: ['Client.id', 'period']
          },
          {
            model: User,
            attributes: ['first_name', 'last_name', 'email']
          }
        ],
        attributes: ['id', 'title'], // Add consultant-specific attributes
        order: [['id', 'ASC']]
      });
  
      // Transform data for response
      const result = consultants.map(consultant => {
        const user = consultant.User || {};
        const timeSubmissions = consultant.TimeSubmissions || [];
  
        const clients = timeSubmissions.map(submission => {
          const client = submission.Client || {};
          const utilization = calculateUtilization(submission.total_hours, client.utilization_target);
  
          return {
            name: client.name,
            client_code: client.client_code,
            service: client.services,
            utilization_target: client.utilization_target,
            total_hours: submission.total_hours,
            utilization_percentage: utilization,
            period: submission.period
          };
        });
  
        return {
          consultant_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email,
          title: consultant.title,
          clients
        };
      });
  
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // Helper function to get period format
  const getPeriodFormat = period => {
    switch (period) {
      case 'weekly':
        return '%Y-%u'; // Year and ISO week number
      case 'monthly':
        return '%Y-%m'; // Year and month
      case 'quarterly':
        return '%Y-Q%q'; // Year and quarter
      default:
        return '%Y-%m-%d'; // Default to daily
    }
  };
  
  // Helper function to calculate utilization percentage
  const calculateUtilization = (totalHours, utilizationTarget) => {
    if (!utilizationTarget || utilizationTarget === 0) return 0;
    return ((totalHours / utilizationTarget) * 100).toFixed(2);
  };
  
  const addConsultantUtilization = async (req,res) => {
    const { last_name, first_name, expected_hours_per_week, actual_utilization} = req.body;
    try{
      const consultant = await User.findOne({
        where:{last_name} && {first_name},
        include: [
          {
            model: Consultant,
            include: [
            {
              model: Client,
              attributes: ['id']
            }
            ],
            attributes: ['id']
          }
        ]
      })

      if(!consultant){
        return res.status(404).json({message: 'Consultant not found'})
      } else {
        await ClientConsultant.create({
          client_id: consultant.Client.id,
          consultant_id: consultant.id,
          expected_work_hours: expected_hours_per_week,
          actual_utilization
        });
      }

      res.status(200).json({message: 'Consultant Utilization Data Fetched Successfully', response})
    } catch (error){
      res.status(500).json({error: error.message})
    }
  };

  const consultantAlert = async(req, res) => {
    const {email, alert_days, alert_message} = req.body;
    try{
      const consultantToAlert = await User.findOne({
        where: { email } ,
        include:[ {
            model: Consultant,
            attributes: []
        } ],
        attributes: ['id']
    });

      if(!consultantToAlert){
        return res.status(404).json({message: 'Failed to find Consultant'});
      } else{
        await consultantAlert.create({
          consultant_id: consultantToAlert.id,
          alert_days,
          alert_message
        })
      }

      res.status(200).json({message: 'Alert has been sent to the consultant'})
    } catch (error){
      res.status(500).json({error: error.message})
    }
  }
  

  module.exports = {
    getConsultants,
    getConsultantswithClient,
    getConsultantById,
    createConsultant,
    updateConsultant,
    deleteConsultant,
    utilizationReport,
    addConsultantUtilization,
    consultantAlert
  };
  
  