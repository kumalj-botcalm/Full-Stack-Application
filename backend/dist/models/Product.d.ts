import { Model } from 'mongoose';
import { IProduct } from '@/types/database';
interface IProductModel extends Model<IProduct> {
    findByCategory(category: string): Promise<IProduct[]>;
    findByPriceRange(minPrice: number, maxPrice: number): Promise<IProduct[]>;
}
declare const ProductModel: IProductModel;
export default ProductModel;
//# sourceMappingURL=Product.d.ts.map