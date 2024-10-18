const Quiz = require('../models/quiz');
const User = require('../models/user');
const { exportToCSV, exportToPDF } = require('../utils/reportGenerator');

class AnalyticsController {
    static async getQuizzesAnalytics(req, res) {
        try {
            const quizzes = await Quiz.getQuizStats();
            return res.status(200).json(quizzes);
        } catch (error) {
            console.error('Error fetching quizzes analytics:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getUsersAnalytics(req, res) {
        try {
            const users = await User.getUserStats();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching user analytics:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getActivityLogs(req, res) {
        try {
            const logs = await ActivityLog.getAllLogs();
            return res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async generateReport(req, res) {
        const format = req.query.format;
        try {
            let report;
            if (format === 'csv') {
                report = await exportToCSV();
            } else if (format === 'pdf') {
                report = await exportToPDF();
            }
            res.setHeader('Content-Disposition', `attachment; filename="report.${format}"`);
            return res.send(report);
        } catch (error) {
            console.error('Error generating report:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = AnalyticsController;
