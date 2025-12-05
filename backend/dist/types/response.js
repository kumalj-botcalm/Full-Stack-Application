"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
exports.createErrorResponse = createErrorResponse;
function createSuccessResponse(message, data = null, notification = null) {
    const response = { message };
    if (data) {
        if (data.user)
            response.user = data.user;
        if (data.users)
            response.users = data.users;
        if (data.product)
            response.product = data.product;
        if (data.products)
            response.products = data.products;
    }
    if (notification) {
        response.notification = notification;
    }
    return response;
}
function createErrorResponse(error, notification = null, additional = {}) {
    const response = { error, ...additional };
    if (notification) {
        response.notification = notification;
    }
    return response;
}
//# sourceMappingURL=response.js.map