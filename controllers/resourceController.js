const { Resource, User, } = require('../models')
//const upload = require ('../utils/multerConfig');
const fs = require('fs');
const path = require('path');

const createResource = async (req, res) => {
    try{
        let authorID = req.user.id;
        const { resource_title, resource_body, additional_fields, status, category } = req.body;
        const mediaFiles = req.files && req.files.length > 0 ? req.files.map(file => file.filename) : null;
        const parsedAdditionalFields = additional_fields && additional_fields.length > 0 ? JSON.parse(additional_fields) : null;

        let tempSlug = resource_title.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').toLowerCase();
        let slug = tempSlug;
        counter = 1;

        while (await Resource.findOne({where: {resource_link: slug}})) {
            slug = `${tempSlug}-${counter}`
            counter++;
        }

        const newResource = await Resource.create({
            author : authorID,
            resource_title,
            resource_body,
            additional_fields: parsedAdditionalFields,
            resource_media: mediaFiles, 
            status,
            category: category || "General Resource",
            resource_link: slug
        });
        res.status(200).json({message: 'New resource added', resource_data:newResource})
    } catch (error){
        res.status(500).json({message: 'Failed to create resource', error: error.message});
        
    }
};

const getResources = async (req,res) => {
    try{
        const allResource = await Resource.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                model: User,
                attributes: ['first_name', 'last_name']
                }
                ]
        });
        res.status(201).json({resource_data: allResource})
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

const getResourceByID = async (req, res) => {
    try{
        const resource = await Resource.findByPk(req.params.id);
        if (!resource){
            return res.status(404).json({message: 'Resource not found'})
        }
        res.status(200).json({resource_data:resource});
    } catch (error){
        res.status(500).json({message: 'Error fetching resource', error: error.message});
    }
};

const getResourceByLoggedInUser = async (req, res) => {
    try{
        const authorID = req.user.id;
        const currentResource = await Resource.findAll({where: {author: authorID}})
        res.status(200).json({data: currentResource});
    } catch (error){
        res.status(500).json({message: 'Error fetching Resource', error: error.message})
    }
};

const getResourcesByStatus = async (req, res) => {
    try {
        const statusFilter = req.query.status || 'draft'; 

        if (statusFilter !== 'draft' && statusFilter !== 'published') {
            return res.status(400).json({ message: 'Invalid status filter' });
        }

        const ResourceList = await Resource.findAll({
            where: { status: statusFilter }
        });

        res.status(200).json({ data: ResourceList });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Resource', error: error.message });
    }
};

const editResource = async (req,res) => {
    try{
        const { resource_title, resource_body, status, additional_fields, category, delete_media} = req.body;
        const resource = await Resource.findByPk(req.params.id);

        if (!resource) {
            return res.status(400).json({message: 'Resource not found' })
        }

       if (resource_title) resource.resource_title = resource_title;
       if (resource_body)  resource.resource_body = resource_body;
       if (status) resource.status = status;
       if (category) resource.category = category;
       
       if (additional_fields) {
            const parsedAdditionalFields = JSON.parse(additional_fields);
            resource.additional_fields = parsedAdditionalFields;
        } 
        
        if (additional_fields === "[]" || resource.additional_fields === [] ){
            resource.additional_fields = [];
        }

       const currentMediaFiles = resource.resource_media ? JSON.parse(resource.resource_media) : [];
        const newMediaFiles = req.files ? req.files.map(file => file.filename) : [];
        let updatedMediaFiles = [...new Set([...currentMediaFiles, ...newMediaFiles])]; // Deduplicate


       if (delete_media) {
        const filesToDelete = JSON.parse(delete_media);

        // Attempt to delete files safely and update the media list
        try {
            deleteFiles(filesToDelete); // Helper function defined below
            updatedMediaFiles = updatedMediaFiles.filter(file => !filesToDelete.includes(file));
        } catch (error) {
            console.error('Error deleting files:', error);
            return res.status(500).json({ message: 'Error deleting media files', error: error.message });
        }
    }
        resource.resource_media = updatedMediaFiles;
        if (resource.resource_media === "[]" || resource.resource_media === [] ){
            resource.resource_media = null;
        }

        await resource.save();
        res.status(200).json({ message: 'Resource edited successfully', data: resource });
    } catch (error) {
        res.status(500).json({ message: 'Error updating resource', error: error.message });
    }
};

const deleteFiles = (files) => {
    files.forEach(file => {
        const filePath = path.join('/home/reviveph/staging.server.revivepharmacyportal.com.au/uploads/', file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
};

const deleteResource = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Find the resource by ID before deletion
    const resource = await Resource.findByPk(id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    // Parse the resource media files
    const mediaFiles = resource.resource_media ? JSON.parse(resource.resource_media) : [];

    // Delete the media files associated with the resource
    if (mediaFiles.length > 0) {
      try {
        deleteFiles(mediaFiles); // Use your deleteFiles helper function
      } catch (error) {
        console.error('Error deleting files:', error);
        return res.status(500).json({ message: 'Error deleting media files', error: error.message });
      }
    }

    // Now, delete the resource from the database
    const deleted = await Resource.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({ message: `Resource deleted with ID: ${id}` });
    } else {
      res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = 
{    createResource,
    getResources,
    getResourceByID,
    editResource,
    deleteResource,
    getResourceByLoggedInUser,
    getResourcesByStatus
};