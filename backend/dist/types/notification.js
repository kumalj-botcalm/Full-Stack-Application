"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplates = exports.NotificationTypes = void 0;
exports.createNotification = createNotification;
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes["SUCCESS"] = "success";
    NotificationTypes["ERROR"] = "error";
    NotificationTypes["WARNING"] = "warning";
    NotificationTypes["INFO"] = "info";
})(NotificationTypes || (exports.NotificationTypes = NotificationTypes = {}));
function createNotification(type, title, message, details) {
    return {
        type,
        title,
        message,
        details
    };
}
class NotificationTemplates {
}
exports.NotificationTemplates = NotificationTemplates;
NotificationTemplates.USER = {
    CREATED: (user) => ({
        type: NotificationTypes.SUCCESS,
        title: 'User Created',
        message: `User ${user.firstName} ${user.lastName} created successfully`,
        details: `User ID: ${user.userId}`
    }),
    UPDATED: (user) => ({
        type: NotificationTypes.SUCCESS,
        title: 'User Updated',
        message: `User ${user.firstName} ${user.lastName} updated successfully`,
        details: `User ID: ${user.userId}`
    }),
    DELETED: (user) => ({
        type: NotificationTypes.SUCCESS,
        title: 'User Deleted',
        message: `User ${user.firstName} ${user.lastName} deleted successfully`,
        details: `User ID: ${user.userId}`
    }),
    NOT_FOUND: () => ({
        type: NotificationTypes.ERROR,
        title: 'User Not Found',
        message: 'The requested user could not be found',
        details: 'Please check the user ID and try again'
    }),
    DUPLICATE_EMAIL: (email) => ({
        type: NotificationTypes.ERROR,
        title: 'Duplicate Email',
        message: `User with email ${email} already exists`,
        details: 'Please use a different email address'
    }),
    EMAIL_CONFLICT: () => ({
        type: NotificationTypes.ERROR,
        title: 'Email Conflict',
        message: 'Another user with this email already exists',
        details: 'Please use a different email address'
    }),
    VALIDATION_ERROR: () => ({
        type: NotificationTypes.ERROR,
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        details: 'All fields are required to create or update a user'
    }),
    SERVER_ERROR: (action) => ({
        type: NotificationTypes.ERROR,
        title: 'Server Error',
        message: `${action} failed. Please try again later.`,
        details: 'An unexpected error occurred on the server'
    })
};
NotificationTemplates.PRODUCT = {
    CREATED: (product) => ({
        type: NotificationTypes.SUCCESS,
        title: 'Product Created',
        message: `Product "${product.name}" created successfully`,
        details: `Product ID: ${product.productId}`
    }),
    UPDATED: (product) => ({
        type: NotificationTypes.SUCCESS,
        title: 'Product Updated',
        message: `Product "${product.name}" updated successfully`,
        details: `Product ID: ${product.productId}`
    }),
    DELETED: (product) => ({
        type: NotificationTypes.SUCCESS,
        title: 'Product Deleted',
        message: `Product "${product.name}" deleted successfully`,
        details: `Product ID: ${product.productId}`
    }),
    NOT_FOUND: () => ({
        type: NotificationTypes.ERROR,
        title: 'Product Not Found',
        message: 'The requested product could not be found',
        details: 'Please check the product ID and try again'
    }),
    VALIDATION_ERROR: () => ({
        type: NotificationTypes.ERROR,
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        details: 'All fields are required to create or update a product'
    }),
    SERVER_ERROR: (action) => ({
        type: NotificationTypes.ERROR,
        title: 'Server Error',
        message: `${action} failed. Please try again later.`,
        details: 'An unexpected error occurred on the server'
    })
};
//# sourceMappingURL=notification.js.map