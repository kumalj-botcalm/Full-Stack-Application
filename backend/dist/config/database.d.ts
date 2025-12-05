import mongoose from 'mongoose';
import { ICounter } from '@/types/database';
export declare function connectDatabase(): Promise<void>;
export declare const CounterModel: mongoose.Model<ICounter, {}, {}, {}, mongoose.Document<unknown, {}, ICounter, {}, {}> & ICounter & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export declare function getNextSequence(name: string): Promise<number>;
//# sourceMappingURL=database.d.ts.map