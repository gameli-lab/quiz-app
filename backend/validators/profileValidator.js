const { body, validationResult } = require('express-validator');

const profileValidator = [
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('password').optional().isLength({ min: 6}).withMessage('Password must be at least 6 characters long')
];

const validateProfile = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
module.exports = { profileValidator, validateProfile }