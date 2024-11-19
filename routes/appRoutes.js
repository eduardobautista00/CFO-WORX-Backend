const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController'); 
//const {permission , can}= require('../middleware/permissionMiddleware');
const permissionController = require('../controllers/permissionController');
const userRoleController = require('../controllers/userRoleController');
const rolePermissionController = require('../controllers/rolePermissionController');
const timeSubmissionController = require('../controllers/timeSubmissionController');
const branchController = require('../controllers/branchController');
const staffLogController = require('../controllers/staffLogController');
const userBranchesController = require('../controllers/userBranchController');
const resourceController = require('../controllers/resourceController');
const clientController = require('../controllers/clientController');
const consultantController = require('../controllers/consultantController');
const adminController = require('../controllers/adminController');
const upload = require ('../utils/multerConfig');

const authorize = require('../middleware/authorizationMiddleware'); 
router.use(authorize);

const permit = require('../middleware/permissionMiddleware');

// CRUD Routes for User
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getCurrentUser);
router.post('/addUser',  userController.addUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);
router.put('/update-user/:id', userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);
router.put('/update-profile', userController.updateProfile);
router.post('/reset-password', userController.resetPassword);
router.post('/confirm-reset-password', userController.confirmResetPassword);

// CRUD Routes for Role
router.get('/roles', roleController.getRoles);
router.get('/role/:id', roleController.getRoleById);
router.post('/create-role', roleController.createRole);
router.put('/update-role/:id', roleController.updateRole);
router.delete('/delete-role/:id', roleController.deleteRole);

// CRUD Routes for Permissions
router.get('/permissions', permissionController.getPermissions);
router.get('/permission/:id', permissionController.getPermissionById);
router.post('/create-permission', permissionController.createPermission);
//router.put('/update-permission/:id', permissionController.updatePermission);
//router.delete('/delete-permission/:id', permissionController.deletePermission);

// CRUD Routes for Role Permissions
router.get('/rolePermissions', rolePermissionController.getRolePermission);
router.get('/rolePermission/:id', rolePermissionController.getRolePermissionById);
router.post('/create-rolePermission', rolePermissionController.createRolePermission);
router.put('/update-rolePermission/:id', rolePermissionController.updateRolePermission);
router.delete('/delete-rolePermission/:id', rolePermissionController.deleteRolePermission);

// CRUD Routes for User Roles
router.get('/userRoles', userRoleController.getUserRoles);
router.delete('/delete-userRole/:id', userRoleController.deleteUserRole);

// Routes for users_branch table
router.get('/users-branches', userBranchesController.getUsersByBranch);
router.post('/create-user-in-branch', userBranchesController.createUserinBranch);
router.delete('/delete-user-in-branch', userBranchesController.deleteUserByBranch);

// Branch Routes
router.get('/branches', branchController.getAllBranches);
router.get('/branch/:id', branchController.getBranchById);
router.post('/create-branch', branchController.createBranch);
router.put('/update-branch/:id', branchController.updateBranch);
router.delete('/delete-branch/:id', branchController.deleteBranch);

// Ticket Routes
router.get('/weekly-reports', timeSubmissionController.fetchWeeklyReport);
router.get('/weekly-report_client/:id', timeSubmissionController.fetchWeeklyReportByClientID);
router.get('/weekly-report_consultant/:id', timeSubmissionController.fetchWeeklyReportByConsultantID);
router.post('/create-weekly-report',  timeSubmissionController.submitWeeklyReport);
router.put('/update-weekly-report/:id', timeSubmissionController.updateWeeklyReport);
router.delete('/delete-weekly-report/:id', timeSubmissionController.deleteWeeklyReport);
router.post('/mass-delete-weekly-reports', timeSubmissionController.massDeleteWeeklyReports);

// Staff Log Route
router.get('/staffLogs', staffLogController.getAllStaffLogs);
router.delete('/delete-log/:id', staffLogController.deleteStaffLog);
router.post('/mass-delete-logs/', staffLogController.massDeleteLogs);

// Resource controller
router.post('/create-resource', upload.array('resource_media'), resourceController.createResource);
router.get('/all-resources', resourceController.getResources);
router.get('/resource/:id', resourceController.getResourceByID);
router.put('/update-resource/:id', upload.array('resource_media'), resourceController.editResource);
router.delete('/delete-resource/:id', resourceController.deleteResource);
router.get('/get-user-resource', resourceController.getResourceByLoggedInUser);
router.get('/resources', resourceController.getResourcesByStatus);

// CRUD Routes for Client Management
router.get('/clients', clientController.getClients);
router.get('/client/:id', clientController.getClientById);
router.post('/create-client', clientController.createClient);
router.put('/update-client/:id', clientController.updateClient);
router.delete('/delete-client/:id', clientController.deleteClient);

// CRUD Routes for Consultant Management
router.get('/consultants', consultantController.getConsultantById);
router.get('/consultant/:id', consultantController.getConsultantById);
router.post('/create-consultant', consultantController.createConsultant);
router.put('/update-consultant/:id', consultantController.updateConsultant);
router.delete('/delete-consultant/:id', consultantController.deleteConsultant);

// Fetch Dashboard
router.get('/dashboard', adminController.fetchDashboard);
router.get('/pending-reports', adminController.fetchPendingReports);
router.put('/update-reportStatus', adminController.updateReportStatus);
router.post('/notify-for-pending', adminController.pendingNotification);

router.get('/client-activity', clientController.clientActivity);
router.get('/utilization-report', consultantController.utilizationReport);

module.exports = router;

