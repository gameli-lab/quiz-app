const Quiz = require('../models/quiz');
const redisclient = require('../utils/redis');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse')


class QuizController {
    static async uploadQuizFile(req, res) {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const filePath = path.join(__dirname, '..', '..', file.path);
        const extension = path.extname(file.origionalname).toLowerCase();

        try {
            var fileContent = '';
            if (extension === '.txt') {
                fileContent = fs.readFileSync(filePath, 'utf-8');
            } else if(extension === '.docx') {
                const result = await mammoth.extractRawText({ path: filePath });
                fileContent = result.value;
            } else if (extension === 'pdf') {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                fileContent = data.text
            } else {
                return res.status(400).json({ error: 'Unsupported file type' });
            }

            const quizData = QuizController.processQuizData(fileContent);
            
            const subjectId = req.body.subjectId;
            const quizId = await Quiz.createQuiz(subjectId, quizData);
            return res.status(201).json({ quizId });
        } catch(error) {
            console.error('Error processing quiz file:', error);
            return res.status(500).json({ error: 'Internal server error' });
        } finally {
            fs.unlinkSync(filePath);
        }
    }

    static async processQuizData(fileContent) {
        const questions = [];
        const lines = fileContent.split('\n');

        var currentQuestion = null;
        var choices = [];
        var correctAnswer = null;

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            if (line.startsWith('Q:')) {
                if (currentQuestion) {
                    questions.push({
                        questionText: currentQuestion,
                        choices,
                        correctAnswer
                    });
                }
                currentQuestion = line.substring(2).trim();
                choices = [];
                correctAnswer = null;
            } else if (line.startsWith('A:')) {
                correctAnswer = line.substring(2).trim();
            } else {
                choices.push(line);
            }
        });

        if (currentQuestion) {
            questions.push({
                questionText: currentQuestion,
                choices,
                correctAnswer
            });
        }
        return questions;

    }

    static async getQuizBySubject(req, res) {
        const { subjectId } = req.params;
        try {
            const quiz = await Quiz.getQuizBySubject(subjectId);
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found for this subject. Please check again later' });
            }
            return res.status(200).json(quiz);
        } catch(error) {
            console.error(`Error fetching quiz: ${error}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async saveResult(req, res) {
        const { score, subjectId } = req.body;
        const token = req.headers['x-token'];
        try {
            const userId = await redisclient.get(`auth_${token}`);
            if(!userId) {
                return res.status(401).json({ error: 'Unauthorised' });
            }
            const resultId = await Quiz.saveResult(userId, subjectId, score);
            return res.status(201).json({ resultId });
        } catch(error) {
            console.error('Error saving result:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}


module.exports = QuizController;