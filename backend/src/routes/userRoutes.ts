import express, { Request, Response } from 'express';
import UserModel from '@/models/User';
import { getNextSequence } from '@/config/database';
import { NotificationTemplates } from '@/types/notification';
import { createSuccessResponse, createErrorResponse } from '@/types/response';
import { IUserInput } from '@/types/database';
import { authenticateToken, requireSeller } from '@/middleware/auth';

const router = express.Router();

// Apply authentication and seller role requirement to all user routes
router.use(authenticateToken);
router.use(requireSeller);


router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'userId';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Create sort object
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count for pagination metadata
    const totalItems = await UserModel.countDocuments({});
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch users with pagination
    const users = await UserModel.find({})
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Create pagination metadata
    const pagination = {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };

    res.json({
      users,
      pagination
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json(
      createErrorResponse('Failed to fetch users')
    );
  }
});

/**
 * POST /users - Add new user
 */
router.post('/', async (req: Request<{}, any, IUserInput>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, birthDate, gender, image } = req.body;
    
    // Validate required fields
    const validation = UserModel.validateUserData(req.body);
    if (!validation.isValid) {
      res.status(400).json(
        createErrorResponse(
          'All fields are required',
          NotificationTemplates.USER.VALIDATION_ERROR(),
          { missing: validation.missing }
        )
      );
      return;
    }

    // Check if user with email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json(
        createErrorResponse(
          'User with this email already exists',
          NotificationTemplates.USER.DUPLICATE_EMAIL(email.toLowerCase())
        )
      );
      return;
    }

    // Get next auto-increment ID
    const userId = await getNextSequence('user_id');

    // Create new user
    const newUser = new UserModel({
      userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      birthDate,
      gender,
      image: image || undefined
    });

    const savedUser = await newUser.save();
    
    res.status(201).json(
      createSuccessResponse(
        'User created successfully',
        { user: savedUser },
        NotificationTemplates.USER.CREATED(savedUser)
      )
    );
  } catch (err: any) {
    console.error('Error creating user:', err);
    if (err.code === 11000) {
      res.status(400).json(
        createErrorResponse(
          'User with this email already exists',
          NotificationTemplates.USER.DUPLICATE_EMAIL('unknown')
        )
      );
    } else {
      res.status(500).json(
        createErrorResponse(
          'Failed to create user',
          NotificationTemplates.USER.SERVER_ERROR('Registration')
        )
      );
    }
  }
});

/**
 * PUT /users/:id - Update user
 */
router.put('/:id', async (req: Request<{ id: string }, any, IUserInput>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, birthDate, gender, image } = req.body;

    // Validate required fields
    const validation = UserModel.validateUserData(req.body);
    if (!validation.isValid) {
      res.status(400).json(
        createErrorResponse(
          'All fields are required',
          NotificationTemplates.USER.VALIDATION_ERROR(),
          { missing: validation.missing }
        )
      );
      return;
    }

    // Check if another user with the same email exists (excluding current user)
    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    if (existingUser) {
      res.status(400).json(
        createErrorResponse(
          'Another user with this email already exists',
          NotificationTemplates.USER.EMAIL_CONFLICT()
        )
      );
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        birthDate,
        gender,
        image: image === null || image === '' ? null : image
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json(
        createErrorResponse(
          'User not found',
          NotificationTemplates.USER.NOT_FOUND()
        )
      );
      return;
    }

    res.json(
      createSuccessResponse(
        'User updated successfully',
        { user: updatedUser },
        NotificationTemplates.USER.UPDATED(updatedUser)
      )
    );
  } catch (err: any) {
    console.error('Error updating user:', err);
    if (err.code === 11000) {
      res.status(400).json(
        createErrorResponse(
          'Another user with this email already exists',
          NotificationTemplates.USER.EMAIL_CONFLICT()
        )
      );
    } else {
      res.status(500).json(
        createErrorResponse(
          'Failed to update user',
          NotificationTemplates.USER.SERVER_ERROR('Update')
        )
      );
    }
  }
});

/**
 * DELETE /users/:id - Delete user
 */
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json(
        createErrorResponse(
          'User not found',
          NotificationTemplates.USER.NOT_FOUND()
        )
      );
      return;
    }

    res.json(
      createSuccessResponse(
        'User deleted successfully',
        { user: deletedUser },
        NotificationTemplates.USER.DELETED(deletedUser)
      )
    );
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json(
      createErrorResponse(
        'Failed to delete user',
        NotificationTemplates.USER.SERVER_ERROR('Delete')
      )
    );
  }
});

export default router;