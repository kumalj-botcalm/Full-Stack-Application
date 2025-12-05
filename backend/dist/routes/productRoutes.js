"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("@/models/Product"));
const notification_1 = require("@/types/notification");
const response_1 = require("@/types/response");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const products = await Product_1.default.find({}).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to fetch products'));
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, price, category, description, inStock } = req.body;
        const validation = Product_1.default.validateProductData(req.body);
        if (!validation.isValid) {
            res.status(400).json((0, response_1.createErrorResponse)('All fields are required', notification_1.NotificationTemplates.PRODUCT.VALIDATION_ERROR(), { missing: validation.missing }));
            return;
        }
        const newProduct = new Product_1.default({
            name: name.trim(),
            price,
            category: category.trim(),
            description: description.trim(),
            inStock
        });
        const savedProduct = await newProduct.save();
        res.status(201).json((0, response_1.createSuccessResponse)('Product created successfully', { product: savedProduct }, notification_1.NotificationTemplates.PRODUCT.CREATED(savedProduct)));
    }
    catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to create product', notification_1.NotificationTemplates.PRODUCT.SERVER_ERROR('Creation')));
    }
});
router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, category, description, inStock } = req.body;
        const validation = Product_1.default.validateProductData(req.body);
        if (!validation.isValid) {
            res.status(400).json((0, response_1.createErrorResponse)('All fields are required', notification_1.NotificationTemplates.PRODUCT.VALIDATION_ERROR(), { missing: validation.missing }));
            return;
        }
        const updatedProduct = await Product_1.default.findByIdAndUpdate(productId, {
            name: name.trim(),
            price,
            category: category.trim(),
            description: description.trim(),
            inStock
        }, { new: true, runValidators: true });
        if (!updatedProduct) {
            res.status(404).json((0, response_1.createErrorResponse)('Product not found', notification_1.NotificationTemplates.PRODUCT.NOT_FOUND()));
            return;
        }
        res.json((0, response_1.createSuccessResponse)('Product updated successfully', { product: updatedProduct }, notification_1.NotificationTemplates.PRODUCT.UPDATED(updatedProduct)));
    }
    catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to update product', notification_1.NotificationTemplates.PRODUCT.SERVER_ERROR('Update')));
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json((0, response_1.createErrorResponse)('Product not found', notification_1.NotificationTemplates.PRODUCT.NOT_FOUND()));
            return;
        }
        res.json((0, response_1.createSuccessResponse)('Product deleted successfully', { product: deletedProduct }, notification_1.NotificationTemplates.PRODUCT.DELETED(deletedProduct)));
    }
    catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to delete product', notification_1.NotificationTemplates.PRODUCT.SERVER_ERROR('Delete')));
    }
});
exports.default = router;
//# sourceMappingURL=productRoutes.js.map