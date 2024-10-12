const { body, validationResult } = require('express-validator');


const uploadValidator = [
    body('file')
    .custom((value, { req }) =>{
        const file = req.file;
        if (!file) {
            throw new Error('No file uploaded');
        }

        if (!file.mimetype.includes('application/pdf') && !file.mimetype.includes('text/plain') && !file.mimetype.includes('application/docx')) {
            throw new Error('Only .txt, .pdf and .docx files are allowed for now');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
        }
        return true;
    }),
];

const validateUpload = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { uploadValidator, validateUpload }