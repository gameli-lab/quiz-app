// utils/reportGenerator.js
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');


const getPlatformData = async () => {
    const db = dbClient.client.db();

    const totalQuizzesTaken = await db.collection('results').countDocuments();

    const scores = await db.collection('results').aggregate([
        { $group: { _id: null, averageScore: { $avg: "$score" } } }
    ]).toArray();
    const averageScore = scores.length > 0 ? scores[0].averageScore : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await db.collection('users').countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });

    const activityLogs = await db.collection('activity_logs').find({}).toArray();

    const totalQuizzesCreated = await db.collection('quizzes').countDocuments();
    const quizCategories = await db.collection('quiz_categories').find({}).toArray();

    return {
        totalQuizzesTaken,
        averageScore: averageScore.toFixed(2),
        activeUsers,
        activityLogs,
        totalQuizzesCreated,
        quizCategories
    };
};


const exportToCSV = async () => {
    const data = await getPlatformData(); // Implement this to fetch relevant data
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    return csv;
};

const exportToPDF = async () => {
    const data = await getPlatformData(); // Implement this to fetch relevant data
    const doc = new PDFDocument();
    let buffer = [];
    doc.on('data', chunk => buffer.push(chunk));
    doc.on('end', () => buffer = Buffer.concat(buffer));

     // Create a PDF report with the data
     doc.fontSize(16).text('Platform Performance Report', { align: 'center' });
     doc.moveDown();
     doc.fontSize(12).text(`Total Quizzes Taken: ${data.totalQuizzesTaken}`);
     doc.text(`Average Score: ${data.averageScore}`);
     doc.text(`Active Users: ${data.activeUsers}`);
     doc.text(`Total Quizzes Created: ${data.totalQuizzesCreated}`);
 
     doc.moveDown();
     doc.text('Quiz Categories:', { underline: true });
     data.quizCategories.forEach(category => {
         doc.text(`- ${category.name}`);
     });
 
     doc.moveDown();
     doc.text('Activity Logs:', { underline: true });
     data.activityLogs.forEach(log => {
         doc.text(`- ${log.action} by ${log.user} at ${new Date(log.timestamp).toLocaleString()}`);
     });
 
    doc.text('Platform Performance Report', { align: 'center' });
    doc.end();
    
    return Buffer.concat(buffer);
};

module.exports = { exportToCSV, exportToPDF };
