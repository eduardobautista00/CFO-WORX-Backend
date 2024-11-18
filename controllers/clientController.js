const {Client, Consultant, User} = require('../models');

const getClients = async (req, res) => {
    try {
      const allClient = await Client.findAll({
        order: [['id', 'ASC']],
        include: [
          {
            model: Consultant,
            include: [
                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                }

            ],
            attributes: ['title'] // Exclude join table attributes
          }
        ]
      });
      res.status(200).json(allClient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
   const getClientById = async (req, res) => {
    try {
      const ClientId = req.params.id;
      const client = await Client.findByPk(ClientId, {
        include: [
            {
              model: Consultant,
              include: [
                  {
                      model: User,
                      attributes: ['first_name', 'last_name']
                  }
  
              ],
              attributes: ['title'] // Exclude join table attributes
            }
          ]
      });
  
      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.json(client);
    } catch (error) {
      console.error('Error fetching Client details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const createClient = async (req, res) => {
    const { client_code, services, utilization_target, revenue,} = req.body;
    try {
      const newClient = await Client.create({ client_code, services, utilization_target, revenue, });
      res.status(201).json({ message: `Client added with ID: ${newClient.id}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updateClient = async (req, res) => {
    const id = parseInt(req.params.id);
    const { client_code, services, utilization_target, revenue,  } = req.body;
    try {
      const [updated] = await Client.update({ client_code, services, utilization_target, revenue,  }, { where: { id } });
      if (updated) {
        const updatedClient = await Client.findByPk(id);
        res.status(200).json(updatedClient);
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteClient = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const deleted = await Client.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: `Client deleted with ID: ${id}` });
      } else {
        res.status(404).json({ error: 'Client not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
  };
  
  