const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['owner', 'tenant']).withMessage('Invalid role'),
    handleValidationErrors
];

const loginValidator = [
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.phone) {
            throw new Error('Email or phone number is required');
        }
        return true;
    }),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

const createPropertyValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('price').isNumeric().withMessage('Price must be a valid number'),
    body('amenities').notEmpty().withMessage('Amenities are required'),
    body('availableRooms').isNumeric().withMessage('Available rooms must be a valid number'),
    body('status').optional().isIn(['Available', 'Occupied']).withMessage('Invalid status'),
    handleValidationErrors
];

const updatePropertyValidator = [
    body('price').optional().isNumeric().withMessage('Price must be a valid number'),
    body('availableRooms').optional().isNumeric().withMessage('Available rooms must be a valid number'),
    body('status').optional().isIn(['Available', 'Occupied']).withMessage('Invalid status'),
    handleValidationErrors
];

module.exports = {
    registerValidator,
    loginValidator,
    createPropertyValidator,
    updatePropertyValidator
};
