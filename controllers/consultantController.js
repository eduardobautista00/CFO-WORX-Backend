const {Client, Consultant, User} = require('../models');

const getConsultants = async (req, res) => {
    try {
      const allConsultant = await Consultant.findAll({
        order: [['id', 'ASC']],
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
  
      res.json(Consultant);
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
  
  module.exports = {
    getConsultants,
    getConsultantById,
    createConsultant,
    updateConsultant,
    deleteConsultant
  };
  
  