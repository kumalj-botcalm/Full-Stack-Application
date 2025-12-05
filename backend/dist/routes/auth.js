"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SystemUser_1 = __importDefault(require("../models/SystemUser"));
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const emailService_1 = require("../services/emailService");
const emailTemplates_1 = require("../templates/emailTemplates");
const passwordGenerator_1 = require("../utils/passwordGenerator");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        const validation = await SystemUser_1.default.validateRegistrationData(userData);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missing: validation.missing
            });
            return;
        }
        const existingUser = await SystemUser_1.default.findByEmail(userData.email);
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
            return;
        }
        const generatedPassword = (0, passwordGenerator_1.generatePassword)(10);
        const hashedPassword = await bcrypt_1.default.hash(generatedPassword, 10);
        const newUser = new SystemUser_1.default({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            birthDate: userData.birthDate,
            mobileNumber: userData.mobileNumber,
            role: userData.role || 'customer',
            isActive: true
        });
        await newUser.save();
        const userResponse = {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            birthDate: newUser.birthDate,
            mobileNumber: newUser.mobileNumber,
            role: newUser.role,
            isActive: newUser.isActive,
            createdAt: newUser.createdAt
        };
        const welcomeHtml = (0, emailTemplates_1.welcomeEmailTemplate)({
            firstName: newUser.firstName,
            email: newUser.email,
            password: generatedPassword,
            loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            appName: 'BotCalm'
        });
        await emailService_1.emailService.sendEmail({
            to: newUser.email,
            subject: 'Welcome to BotCalm!',
            html: welcomeHtml
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userResponse,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const validation = await SystemUser_1.default.validateLoginData({ email, password });
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missing: validation.missing
            });
            return;
        }
        const user = await SystemUser_1.default.findByEmail(email);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        user.lastLogin = new Date();
        await user.save();
        const userResponse = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthDate: user.birthDate,
            mobileNumber: user.mobileNumber,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };
        const tokenPayload = {
            userId: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role
        };
        const token = (0, jwt_1.generateToken)(tokenPayload);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: userResponse,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const existingUser = await SystemUser_1.default.findByEmail(email);
        res.status(200).json({
            success: true,
            available: !existingUser,
            message: existingUser ? 'Email is already registered' : 'Email is available'
        });
    }
    catch (error) {
        console.error('Email check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.patch('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, mobileNumber, birthDate } = req.body;
        if (!firstName && !lastName && !mobileNumber && !birthDate) {
            res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update'
            });
            return;
        }
        const updateData = {};
        if (firstName)
            updateData.firstName = firstName;
        if (lastName)
            updateData.lastName = lastName;
        if (mobileNumber)
            updateData.mobileNumber = mobileNumber;
        if (birthDate)
            updateData.birthDate = birthDate;
        const updatedUser = await SystemUser_1.default.findOneAndUpdate({ userId: userId }, { $set: updateData }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        const userResponse = {
            userId: updatedUser.userId,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            birthDate: updatedUser.birthDate,
            mobileNumber: updatedUser.mobileNumber,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            lastLogin: updatedUser.lastLogin,
            createdAt: updatedUser.createdAt
        };
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: userResponse
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map