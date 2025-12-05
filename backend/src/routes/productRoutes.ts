import express, { Request, Response } from 'express';
import ProductModel from '@/models/Product';
import { createErrorResponse } from '@/types/response';
import { authenticateToken, requireSeller } from '@/middleware/auth';
import { getNextSequence } from '@/config/database';

const router = express.Router();

// Apply authentication and seller role requirement to CUD operations (Create, Update, Delete)
// GET is public for viewing products, but CUD operations require seller role

router.use(authenticateToken);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    const category = req.query.category as string;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Create sort object
    const sort: { [key: string]: 1 | -1 } = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Create filter object
    const filter: { [key: string]: any } = {};
    if (category) {
      filter.category = new RegExp(category, 'i'); // Case-insensitive search
    }

    // Get total count for pagination metadata
    const totalItems = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    // Fetch products with pagination
    const products = await ProductModel.find(filter)
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
      products,
      pagination
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json(
      createErrorResponse('Failed to fetch products')
    );
  }
});

/**
 * POST /products - Create a new product
 */
router.post('/',  requireSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      res.status(400).json(
        createErrorResponse('Name, price, and category are required')
      );
      return;
    }

    // Generate auto-incrementing productId
    const productId = await getNextSequence('product_id');

    // Create new product
    const newProduct = new ProductModel({
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
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json(
      createErrorResponse('Failed to create product')
    );
  }
});

/**
 * PUT /products/:id - Update an existing product
 */
router.put('/:id', requireSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      res.status(400).json(
        createErrorResponse('Name, price, and category are required')
      );
      return;
    }

    // Find and update product by productId
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { productId: Number(id) },
      {
        name,
        description,
        price: Number(price),
        category,
        image: image || undefined,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json(
        createErrorResponse('Product not found')
      );
      return;
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json(
      createErrorResponse('Failed to update product')
    );
  }
});

/**
 * DELETE /products/:id - Delete a product
 */
router.delete('/:id', requireSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find and delete product by productId
    const deletedProduct = await ProductModel.findOneAndDelete({ productId: Number(id) });

    if (!deletedProduct) {
      res.status(404).json(
        createErrorResponse('Product not found')
      );
      return;
    }

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json(
      createErrorResponse('Failed to delete product')
    );
  }
});

export default router;