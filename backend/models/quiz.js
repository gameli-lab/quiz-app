const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');

class Quiz {
    static async createQuiz(subjectId, questions) {
        const db = dbClient.client.db();
        const quizData = {
            subject: new ObjectId(subjectId),
            questions,
        };
        const result = await db.collection('quizzes').insertOne(quizData);
        return result.insertedId;
    }

    static async getQuizBySubject(subjectId) {
        const db = dbClient.client.db();
        const quiz = await db.collection('quizzes').findOne({ subject: new ObjectId(subjectId) });
        return quiz;
    }

    static async saveResult(userId, subjectId, score) {
        const db = dbClient.client.db();
        const resultData = {
            userId: new ObjectId(userId),
            subject: new ObjectId(subjectId),
            score,
            completedAt: new Date(),
        };
        const result = await db.collection('results').insertOne(resultData);
        return result.insertedId;
    }
}

module.exports = Quiz;