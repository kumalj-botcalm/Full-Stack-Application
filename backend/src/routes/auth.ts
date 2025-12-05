import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import SystemUser from '../models/SystemUser';
import { ISystemUserInput } from '../types/database';
import { generateToken, TokenPayload } from '../utils/jwt';
import { authenticateToken } from '../middleware/auth';
import { emailService } from '../services/emailService';
import { welcomeEmailTemplate } from '../templates/emailTemplates';
import { generatePassword } from '../utils/passwordGenerator';

const router = Router();

// Register endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: ISystemUserInput = req.body;

    // Validate required fields
    const validation = await SystemUser.validateRegistrationData(userData);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: validation.missing
      });
      return;
    }

    // Check if email already exists
    const existingUser = await SystemUser.findByEmail(userData.email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
      return;
    }

    // Generate password
    const generatedPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create new user
    const newUser = new SystemUser({
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

    // Return user data without password
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


    // Send welcome email
    const welcomeHtml = welcomeEmailTemplate({
      firstName: newUser.firstName,
      email: newUser.email,
      password: generatedPassword,
      loginUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      appName: 'BotCalm'
    });
    
    await emailService.sendEmail({
      to: newUser.email,
      subject: 'Welcome to BotCalm!',
      html: welcomeHtml
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
      
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    const validation = await SystemUser.validateLoginData({ email, password });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missing: validation.missing
      });
      return;
    }

    // Find user by email
    const user = await SystemUser.findByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user data without password
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

    // Generate JWT token
    const tokenPayload: TokenPayload = {
      userId: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    };
    const token = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Check email availability endpoint
router.post('/check-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    const existingUser = await SystemUser.findByEmail(email);
    
    res.status(200).json({
      success: true,
      available: !existingUser,
      message: existingUser ? 'Email is already registered' : 'Email is available'
    });

  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});



// Update current user profile endpoint (protected)
router.patch('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { firstName, lastName, mobileNumber, birthDate } = req.body;
    
    // Note: role is intentionally excluded from profile updates for security
    // Only firstName, lastName, mobileNumber, and birthDate can be updated

    // Validate that at least one field is provided
    if (!firstName && !lastName && !mobileNumber && !birthDate) {
      res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (birthDate) updateData.birthDate = birthDate;
    
    // Update user
    const updatedUser = await SystemUser.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Return updated user data without password
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

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;