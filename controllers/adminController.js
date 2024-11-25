const { Client, Consultant, TimeSubmission, DailyAllocation, User, Admin } = require('../models');
const moment = require('moment'); // For date manipulation (if needed)
const { sendEmail } = require('../utils/emailService');
const { compare } = require('bcryptjs');
const crypto = require('crypto');

const fetchDashboard = async (req, res) => {
    try {
        // 1. Calculate total hours from all weekly reports
        const totalHoursResult = await TimeSubmission.sum('total_hours');
        const totalHours = totalHoursResult || 0;

        // 2. Get total hours worked per client and number of clients
        const clientsData = await Client.findAll({
            include: [
                {
                    model: TimeSubmission,
                    include: [{
                        model: Consultant,
                        include: [{
                            model:User,
                            attributes: ['first_name', 'last_name']
                        }]
                    }],
                    attributes: ['total_hours'],
                },
            ],
            attributes: ['id', 'name', 'client_code'], 
        });

        const clientHours = clientsData.map(client => ({
            client_id: client.id,
            client_name: client.name,
            client_code: client.client_code,
            total_hours: client.TimeSubmissions.reduce((sum, ts) => sum + ts.total_hours, 0),
        }));

        const totalClients = clientsData.length;

        // 3. Find pending reports (unsubmitted)
        const consultants = await Consultant.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email'],
                },

            ],
            attributes: ['id'], // Include only necessary fields
        });

        const currentWeekStart = moment().startOf('week').toDate();
        const pendingReports = [];

        for (const consultant of consultants) {
            const timeSubmission = await TimeSubmission.findOne({
                where: {
                    consultant_id: consultant.id,
                    week_start: currentWeekStart,
                    submissionStatus: submissionStatus == 'Unsubmitted'
                },
            });

            if (!timeSubmission) {
                pendingReports.push({
                    consultant_id: consultant.id,
                    user_id: consultant.User?.id,
                    user_name: `${consultant.User?.first_name} ${consultant.User?.last_name}`,
                    email: consultant.User?.email,
                    reminder_date: currentWeekStart,
                });
            }
        }

        // 4. Return the dashboard data
        const dashboardData = {
            total_hours: totalHours,
            clientsData,
            total_clients: totalClients,
            client_hours: clientHours,
            pending_reports: pendingReports,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'An error occurred while fetching dashboard data.' });
    }
};

const fetchPendingReports = async(req, res) => {
    try{
        const pendingReports = await TimeSubmission.findAll({ where: {submissionStatus: 'Submitted', approvalStatus: 'Pending'},
            include: [
                {
                    model: Consultant,
                    include: [
                        {
                            model: User,
                            attributes: ['first_name', 'last_name']
                        }
                    ],
                    attributes: [ ]
                }
            ]
        });
        res.status(200).json(pendingReports);
    } catch (error) {
        console.error('Error Fetching Pending Reports:', error);
        res.status(500).json({ error: 'An error occurred while fetching reports.' });
    }
}

const updateReportStatus = async(req, res) => {
    const reportID = parseInt(req.params.id);
    const { approvalStatus } = req.body
    try{
        if (!['Approved', 'Rejected'].includes(approvalStatus)) {
            return res.status(400).json({ error: 'Invalid approval status. Use "Approved" or "Rejected".' });
        }

        const [updated] = await TimeSubmission.update({approvalStatus}, { where: {id: reportID}});
        if (updated){
            const updatedReportStatus = await TimeSubmission.findByPk(reportID);
            res.status(200).json(updatedReportStatus);
        } else {
            res.status(404).json({error: 'Report Status Update Failed, Try Again.'});
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred in trying to update.' });
    }
};

const pendingNotification = async(req, res) => {

    try{
        const pendingReports = await TimeSubmission.findAll({ where: {submissionStatus: 'Unsubmitted'},
        include: [
            {
                model: Consultant,
                include: [
                    {
                        model: User,
                        attributes: ['first_name', 'last_name', 'email' ]
                    }
                ],
                attributes: [ 'id' ]
            }
        ]
    });

    if (!pendingReports){
        return res.status(404).json({error: 'There are no unsubmitted reports'});
    } else {
        const editUrl = `https://google.com`
        await sendEmail(pendingReports.Consultant.User.email, 
           'Weekly Time Submission Reminder',
           `Hello, this is a reminder to send your weekly reports for this week.
           follow this link to edit and submit ASAP:${editUrl}`
           )
    }
        res.status(200).json({ message: 'Report reminder email sent successfully.' });
    } catch (error){
        res.status(500).json({ error: 'An error occurred when sending the email, try again.' });
    }
};

const changeAdminEmail = async (req, res) => {
    const { current_email, new_email, confirm_newEmail} = req.body;
    try{
        const adminID = req.user.id;
        const admin = await User.findByPk(adminID);

        if (!admin) {
            return res.status(404).json({message: 'Admin not found'});
        }

        if (new_email == confirm_newEmail){
            const isNotSameEmail = await compare(current_email, new_email);
            if (!isNotSameEmail) {
                return res.status(400).json({message: "New Email can't be the same as old email"})
            }

            admin.email = new_email;
        } else {
            return res.status(400).json({message: "Confirm Email doesn't Match, try again"});
        };

        await admin.save();
        res.status(200).json({message: 'Admin Email Updated Successfully'})
        await sendEmail('info@cfo-worx.com', 'Admin Email Updated',
        `This is to inform you that the Admin Email has been Updated, the new email is : ${new_email}`);
    } catch (error){
        res.status(500).json({error: error.message})
    }

}

const sendResetPassword = async (req, res) => {
    const {contractor_name, contractor_email} = req.body
    try{
        const contractor = await User.findOne({where: {contractor_email} && {contractor_name}})

        if(!contractor){
            return res.status(404).json({message: 'Invalid Email, Try Again.'});
        }

        const resetToken = crypto.randomBytes(3).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour


        await ResetPassword.create({
            user_id: contractor.id,
            token: resetToken,
            expiresAt: resetTokenExpires
          });

        const resetLink = `https://google.com`;
        await sendEmail(contractor_email, 'Password Reset',
        `Here is the password reset link. You only have 1 hour to complete it
        Link: ${resetLink}`);
        res.status(200).json({message: 'Password reset link has been sent successfully.'})
    } catch (error){
        res.status(500).json({error: error.message})
    }
};
const fetchadminEmail = async (req, res) => {
    
    try{

        res.status(200).json({message: 'Admin email fetched successfully'})
    } catch (error){
        res.status(500).json({error: error.message})
    }

}

const setAutomaticReportDate = async (req, res) => {
    const { date, admin_email } = req.body;
    try{
        const adminUser = await User.findOne({
            where: { email: admin_email },
            include:[ {
                model: Role,
                through: UserRole, 
                where: {role_name: 'Admin'}
            } ],
            attributes: ['id']
        });

        if (!adminUser) {
            return res.status(404).json({message: 'Error fetching admin email!'});
        } else {     
         await Admin.create({ 
            user_id: User.id,
            auto_create_date: date } /* where admin_email fetched is equal to the admin's email */)
        }

        res.status(200).json({message: 'Automatic Report Date has been set.'})
    } catch (error){
        res.status(500).json({error: error.message})
    }
}


module.exports = {
    fetchDashboard,
    fetchPendingReports,
    updateReportStatus,
    pendingNotification,
    changeAdminEmail,
    sendResetPassword,
    setAutomaticReportDate,

};
