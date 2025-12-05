"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("@/models/Product"));
const response_1 = require("@/types/response");
const auth_1 = require("@/middleware/auth");
const database_1 = require("@/config/database");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const category = req.query.category;
        const skip = (page - 1) * limit;
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const filter = {};
        if (category) {
            filter.category = new RegExp(category, 'i');
        }
        const totalItems = await Product_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);
        const products = await Product_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const pagination = {
            page,
            limit,
            totalItems,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1
        };
        res.json({
            products,
            pagination
        });
    }
    catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to fetch products'));
    }
});
router.post('/', auth_1.requireSeller, async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;
        if (!name || !price || !category) {
            res.status(400).json((0, response_1.createErrorResponse)('Name, price, and category are required'));
            return;
        }
        const productId = await (0, database_1.getNextSequence)('product_id');
        const newProduct = new Product_1.default({
            productId,
            name,
            description,
            price: Number(price),
            category,
            image: image || undefined
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });
    }
    catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to create product'));
    }
});
router.put('/:id', auth_1.requireSeller, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, image } = req.body;
        if (!name || !price || !category) {
            res.status(400).json((0, response_1.createErrorResponse)('Name, price, and category are required'));
            return;
        }
        const updatedProduct = await Product_1.default.findOneAndUpdate({ productId: Number(id) }, {
            name,
            description,
            price: Number(price),
            category,
            image: image || undefined,
            updatedAt: new Date()
        }, { new: true, runValidators: true });
        if (!updatedProduct) {
            res.status(404).json((0, response_1.createErrorResponse)('Product not found'));
            return;
        }
        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    }
    catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to update product'));
    }
});
router.delete('/:id', auth_1.requireSeller, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product_1.default.findOneAndDelete({ productId: Number(id) });
        if (!deletedProduct) {
            res.status(404).json((0, response_1.createErrorResponse)('Product not found'));
            return;
        }
        res.json({
            message: 'Product deleted successfully',
            product: deletedProduct
        });
    }
    catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json((0, response_1.createErrorResponse)('Failed to delete product'));
    }
});
exports.default = router;
//# sourceMappingURL=productRoutes.js.map