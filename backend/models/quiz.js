const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');

class Quiz {
    // Create a new quiz
    static async createQuiz(subjectId, questions) {
        const db = dbClient.client.db();
        const quizData = {
            subject: new ObjectId(subjectId),
            questions,
            status: 'pending', // New quizzes start as 'pending'
            createdAt: new Date(),
        };
        const result = await db.collection('quizzes').insertOne(quizData);
        return result.insertedId;
    }

    // Get a quiz by its subject ID
    static async getQuizBySubject(subjectId) {
        const db = dbClient.client.db();
        const quiz = await db.collection('quizzes').findOne({ subject: new ObjectId(subjectId) });
        return quiz;
    }

    // Save a user's result for a quiz
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

    // Approve or update the status of a quiz
    static async updateQuizStatus(quizId, status) {
        const db = dbClient.client.db();
        return await db.collection('quizzes').updateOne(
            { _id: new ObjectId(quizId) },
            { $set: { status } }
        );
    }

    // Fetch all quizzes with optional filters (e.g., category or status)
    static async getAllQuizzes(filters = {}) {
        const db = dbClient.client.db();
        return await db.collection('quizzes').find(filters).toArray();
    }

    // Delete a quiz by its ID
    static async deleteQuiz(quizId) {
        const db = dbClient.client.db();
        return await db.collection('quizzes').deleteOne({ _id: new ObjectId(quizId) });
    }

    // Create a new quiz category
    static async createCategory(name) {
        const db = dbClient.client.db();
        const categoryData = {
            name,
            createdAt: new Date(),
        };
        return await db.collection('categories').insertOne(categoryData);
    }

    // Update a quiz category by its ID
    static async updateCategory(categoryId, name) {
        const db = dbClient.client.db();
        return await db.collection('categories').updateOne(
            { _id: new ObjectId(categoryId) },
            { $set: { name } }
        );
    }

    // Delete a quiz category by its ID
    static async deleteCategory(categoryId) {
        const db = dbClient.client.db();
        return await db.collection('categories').deleteOne({ _id: new ObjectId(categoryId) });
    }
}

module.exports = Quiz;
