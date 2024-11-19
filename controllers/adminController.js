const { Client, Consultant, TimeSubmission, DailyAllocation, User } = require('../models');
const moment = require('moment'); // For date manipulation (if needed)
const { sendEmail } = require('../utils/emailService');

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

                {
                    model: User,
                    attributes: ['first_name', 'last_name']
                }
            ],
            attributes: ['id', 'client_code'], 
        });

        const clientHours = clientsData.map(client => ({
            client_id: client.id,
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
                    user_name: consultant.User?.name,
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
        const editUrl = `https://google.com`
     await sendEmail(pendingReports.Consultant.User.email, 
        'Weekly Time Submission Reminder',
        `Hello, this is a reminder to send your weekly reports for this week.
        follow this link to edit and submit ASAP:${editUrl}`
        )
        res.status(200).json({ message: 'Report reminder email sent successfully.' });
    } catch (error){
        res.status(500).json({ error: 'An error occurred when sending the email, try again.' });
    }
};

module.exports = {
    fetchDashboard,
    fetchPendingReports,
    updateReportStatus,
    pendingNotification
};