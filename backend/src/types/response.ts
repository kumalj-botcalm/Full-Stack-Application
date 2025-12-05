import { INotification } from './notification';

/**
 * Response types and utilities for API responses
 */

export interface ISuccessResponse<T = any> {
  message: string;
  user?: T;
  users?: T[];
  product?: T;
  products?: T[];
  notification?: INotification;
}

export interface IErrorResponse {
  error: string;
  notification?: INotification;
  missing?: Record<string, boolean>;
  [key: string]: any;
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  message: string,
  data: Partial<{
    user?: T;
    users?: T[];
    product?: T;
    products?: T[];
  }> | null = null,
  notification: INotification | null = null
): ISuccessResponse<T> {
  const response: ISuccessResponse<T> = { message };
  
  if (data) {
    if (data.user) response.user = data.user;
    if (data.users) response.users = data.users;
    if (data.product) response.product = data.product;
    if (data.products) response.products = data.products;
  }
  
  if (notification) {
    response.notification = notification;
  }
  
  return response;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: string,
  notification: INotification | null = null,
  additional: Record<string, any> = {}
): IErrorResponse {
  const response: IErrorResponse = { error, ...additional };
  
  if (notification) {
    response.notification = notification;
  }
  
  return response;
}