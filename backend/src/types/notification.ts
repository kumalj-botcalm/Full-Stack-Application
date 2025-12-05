/**
 * Notification types for API responses
 */

import { IUser } from './database';

export enum NotificationTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface INotification {
  type: NotificationTypes;
  title: string;
  message: string;
  details: string;
}

/**
 * Creates a notification object for API responses
 */
export function createNotification(
  type: NotificationTypes,
  title: string,
  message: string,
  details: string
): INotification {
  return {
    type,
    title,
    message,
    details
  };
}

export class NotificationTemplates {
  // User notifications
  static readonly USER = {
    CREATED: (user: IUser): INotification => ({
      type: NotificationTypes.SUCCESS,
      title: 'User Created',
      message: `User ${user.firstName} ${user.lastName} created successfully`,
      details: `User ID: ${user.userId}`
    }),
    
    UPDATED: (user: IUser): INotification => ({
      type: NotificationTypes.SUCCESS,
      title: 'User Updated',
      message: `User ${user.firstName} ${user.lastName} updated successfully`,
      details: `User ID: ${user.userId}`
    }),
    
    DELETED: (user: IUser): INotification => ({
      type: NotificationTypes.SUCCESS,
      title: 'User Deleted',
      message: `User ${user.firstName} ${user.lastName} deleted successfully`,
      details: `User ID: ${user.userId}`
    }),
    
    NOT_FOUND: (): INotification => ({
      type: NotificationTypes.ERROR,
      title: 'User Not Found',
      message: 'The requested user could not be found',
      details: 'Please check the user ID and try again'
    }),
    
    DUPLICATE_EMAIL: (email: string): INotification => ({
      type: NotificationTypes.ERROR,
      title: 'Duplicate Email',
      message: `User with email ${email} already exists`,
      details: 'Please use a different email address'
    }),
    
    EMAIL_CONFLICT: (): INotification => ({
      type: NotificationTypes.ERROR,
      title: 'Email Conflict',
      message: 'Another user with this email already exists',
      details: 'Please use a different email address'
    }),
    
    VALIDATION_ERROR: (): INotification => ({
      type: NotificationTypes.ERROR,
      title: 'Validation Error',
      message: 'Please fill in all required fields',
      details: 'All fields are required to create or update a user'
    }),
    
    SERVER_ERROR: (action: string): INotification => ({
      type: NotificationTypes.ERROR,
      title: 'Server Error',
      message: `${action} failed. Please try again later.`,
      details: 'An unexpected error occurred on the server'
    })
  };
}