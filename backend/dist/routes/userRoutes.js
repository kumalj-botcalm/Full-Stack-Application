"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("@/models/User"));
const database_1 = require("@/config/database");
const notification_1 = require("@/types/notification");
const response_1 = require("@/types/response");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const users = await User_1.default.find({}).sort({ userId: -1 });
        res.json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to fetch users'));
    }
});
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, birthDate, gender } = req.body;
        const validation = User_1.default.validateUserData(req.body);
        if (!validation.isValid) {
            res.status(400).json((0, response_1.createErrorResponse)('All fields are required', notification_1.NotificationTemplates.USER.VALIDATION_ERROR(), { missing: validation.missing }));
            return;
        }
        const existingUser = await User_1.default.findByEmail(email);
        if (existingUser) {
            res.status(400).json((0, response_1.createErrorResponse)('User with this email already exists', notification_1.NotificationTemplates.USER.DUPLICATE_EMAIL(email.toLowerCase())));
            return;
        }
        const userId = await (0, database_1.getNextSequence)('user_id');
        const newUser = new User_1.default({
            userId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            birthDate,
            gender
        });
        const savedUser = await newUser.save();
        res.status(201).json((0, response_1.createSuccessResponse)('User created successfully', { user: savedUser }, notification_1.NotificationTemplates.USER.CREATED(savedUser)));
    }
    catch (err) {
        console.error('Error creating user:', err);
        if (err.code === 11000) {
            res.status(400).json((0, response_1.createErrorResponse)('User with this email already exists', notification_1.NotificationTemplates.USER.DUPLICATE_EMAIL('unknown')));
        }
        else {
            res.status(500).json((0, response_1.createErrorResponse)('Failed to create user', notification_1.NotificationTemplates.USER.SERVER_ERROR('Registration')));
        }
    }
});
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, birthDate, gender } = req.body;
        const validation = User_1.default.validateUserData(req.body);
        if (!validation.isValid) {
            res.status(400).json((0, response_1.createErrorResponse)('All fields are required', notification_1.NotificationTemplates.USER.VALIDATION_ERROR(), { missing: validation.missing }));
            return;
        }
        const existingUser = await User_1.default.findOne({
            email: email.toLowerCase(),
            _id: { $ne: userId }
        });
        if (existingUser) {
            res.status(400).json((0, response_1.createErrorResponse)('Another user with this email already exists', notification_1.NotificationTemplates.USER.EMAIL_CONFLICT()));
            return;
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            birthDate,
            gender
        }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json((0, response_1.createErrorResponse)('User not found', notification_1.NotificationTemplates.USER.NOT_FOUND()));
            return;
        }
        res.json((0, response_1.createSuccessResponse)('User updated successfully', { user: updatedUser }, notification_1.NotificationTemplates.USER.UPDATED(updatedUser)));
    }
    catch (err) {
        console.error('Error updating user:', err);
        if (err.code === 11000) {
            res.status(400).json((0, response_1.createErrorResponse)('Another user with this email already exists', notification_1.NotificationTemplates.USER.EMAIL_CONFLICT()));
        }
        else {
            res.status(500).json((0, response_1.createErrorResponse)('Failed to update user', notification_1.NotificationTemplates.USER.SERVER_ERROR('Update')));
        }
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            res.status(404).json((0, response_1.createErrorResponse)('User not found', notification_1.NotificationTemplates.USER.NOT_FOUND()));
            return;
        }
        res.json((0, response_1.createSuccessResponse)('User deleted successfully', { user: deletedUser }, notification_1.NotificationTemplates.USER.DELETED(deletedUser)));
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to delete user', notification_1.NotificationTemplates.USER.SERVER_ERROR('Delete')));
    }
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map