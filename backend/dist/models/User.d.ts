import { Model } from 'mongoose';
import { IUser, IValidationResult, IUserInput } from '@/types/database';
interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    findByUserId(userId: number): Promise<IUser | null>;
    validateUserData(userData: Partial<IUserInput>): IValidationResult;
}
declare const UserModel: IUserModel;
export default UserModel;
//# sourceMappingURL=User.d.ts.map