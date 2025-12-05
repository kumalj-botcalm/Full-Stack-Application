import { Model } from 'mongoose';
import { ISystemUser, ISystemUserInput, IValidationResult } from '@/types/database';
interface ISystemUserModel extends Model<ISystemUser> {
    findByEmail(email: string): Promise<ISystemUser | null>;
    findByUserId(userId: number): Promise<ISystemUser | null>;
    validateRegistrationData(userData: Partial<ISystemUserInput>): IValidationResult;
    validateLoginData(userData: {
        email?: string;
        password?: string;
    }): IValidationResult;
}
declare const SystemUserModel: ISystemUserModel;
export default SystemUserModel;
//# sourceMappingURL=SystemUser.d.ts.map