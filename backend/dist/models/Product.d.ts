import { Model } from 'mongoose';
import { IProduct, IProductInput, IValidationResult } from '@/types/database';
interface IProductModel extends Model<IProduct> {
    findByCategory(category: string): Promise<IProduct[]>;
    findByPriceRange(minPrice: number, maxPrice: number): Promise<IProduct[]>;
    validateProductData(data: IProductInput): IValidationResult;
}
declare const ProductModel: IProductModel;
export default ProductModel;
//# sourceMappingURL=Product.d.ts.map