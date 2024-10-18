const Settings = require('../models/settings');
const { exportToCSV, exportToPDF } = require('../utils/reportGenerator');

class SettingsController {
    static async getSettings(req, res) {
        try {
            const settings = await Settings.getSettings();
            return res.status(200).json(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateSettings(req, res) {
        const { theme, googleAnalyticsId, paymentGatewayKey } = req.body;
        try {
            await Settings.updateSettings({ theme, googleAnalyticsId, paymentGatewayKey });
            return res.status(200).json({ message: 'Settings updated successfully' });
        } catch (error) {
            console.error('Error updating settings:', error);
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

module.exports = SettingsController;
