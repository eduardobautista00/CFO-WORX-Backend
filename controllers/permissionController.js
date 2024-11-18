const {Permission} = require('../models/');

const getPermissions = async (req, res) => {
    try {
      const allPermission = await Permission.findAll({
        order: [['id', 'ASC']],
      });
      res.status(200).json(allPermission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getPermissionById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const permission = await Permission.findByPk(id);
      if (permission) {
        res.status(200).json(permission);
      } else {
        res.status(404).json({ error: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const createPermission = async (req, res) => {
    const { permission_name } = req.body;
    try {
      const newPermission = await Permission.create({ permission_name });
      res.status(201).json({ message: `Permission added with ID: ${newPermission.id}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const updatePermission = async (req, res) => {
    const id = parseInt(req.params.id);
    const { permission_name } = req.body;
    try {
      const [updated] = await Permission.update({ permission_name }, { where: { id } });
      if (updated) {
        const updatedPermission = await Permission.findByPk(id);
        res.status(200).json(updatedPermission);
      } else {
        res.status(404).json({ error: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deletePermission = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const deleted = await Permission.destroy({ where: { id } });
      if (deleted) {
        res.status(200).json({ message: `Permission deleted with ID: ${id}` });
      } else {
        res.status(404).json({ error: 'Permission not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
  };
  
  