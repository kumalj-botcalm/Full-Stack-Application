import mongoose, { Schema, Model } from 'mongoose';
import { IProduct } from '@/types/database';

/**
 * Product Schema Definition
 */
const ProductSchema = new Schema<IProduct>({
  productId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: false
  },

}, {
  timestamps: true
});

/**
 * Product model methods
 */
ProductSchema.methods.getFormattedPrice = function(this: IProduct): string {
  return `$${this.price.toFixed(2)}`;
};

/**
 * Static methods for Product model
 */
ProductSchema.statics.findByCategory = function(category: string) {
  return this.find({ category });
};

ProductSchema.statics.findByPriceRange = function(minPrice: number, maxPrice: number) {
  return this.find({ 
    price: { 
      $gte: minPrice, 
      $lte: maxPrice 
    } 
  });
};

// Define the Product model interface with static methods (View Only)
interface IProductModel extends Model<IProduct> {
  findByCategory(category: string): Promise<IProduct[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<IProduct[]>;
}

const ProductModel = mongoose.model<IProduct, IProductModel>('Product', ProductSchema, 'products');

export default ProductModel;