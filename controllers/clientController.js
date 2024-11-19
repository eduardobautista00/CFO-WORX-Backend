const {Client, Consultant, User, TimeSubmission} = require('../models');
const sequelize = require('sequelize');

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
            attributes: ['title'] 
          }
        ],
        attributes: ['client_code', 'services', 'utilization_target', 'revenue' ]
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
              attributes: ['title'] 
            }
          ],
          attributes: ['client_code', 'services', 'utilization_target', 'revenue' ]
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
    const { client_code, services, utilization_target, revenue, } = req.body;
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


  const clientActivity = async (req, res) => {
    const { consultant_id } = req.query; // Optional filter for a specific consultant

    try {
        // Query the database
        const clients = await Client.findAll({
            include: [
                {
                    model: Consultant,
                    include: [
                        {
                            model: User,
                            attributes: ['first_name', 'last_name'] // Consultant user details
                        }
                    ],
                    attributes: ['title'], // Consultant's title
                    where: consultant_id ? { id: consultant_id } : undefined // Optional filter by consultant_id
                },
                {
                    model: TimeSubmission,
                    attributes: [
                        'client_id',
                        [sequelize.fn('SUM', sequelize.col('total_hours')), 'total_hours'] // Sum total_hours per client
                    ],
                    where: { approvalStatus: 'Approved' }, // Only approved submissions
                    required: false, // Include clients even if they have no submissions
                    group: ['TimeSubmission.client_id']
                }
            ],
            attributes: ['id', 'client_code', 'services'], // Client details
            order: [['client_code', 'ASC']]
        });

        // Transform data into the required format
        const result = clients.map(client => {
            const consultant = client.Consultants[0] || {}; // Assuming one consultant per client
            const user = consultant.User || {};
            const totalHours = client.TimeSubmissions?.[0]?.dataValues?.total_hours || 0;

            return {
                client_name: client.name,
                total_hours: parseFloat(totalHours), // Convert to a float for clarity
                services: client.services,
                consultant_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                consultant_title: consultant.title || ''
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
  
  module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    clientActivity
  };
  
  