import { INotification } from './notification';
export interface ISuccessResponse<T = any> {
    message: string;
    user?: T;
    users?: T[];
    product?: T;
    products?: T[];
    notification?: INotification;
}
export interface IErrorResponse {
    error: string;
    notification?: INotification;
    missing?: Record<string, boolean>;
    [key: string]: any;
}
export declare function createSuccessResponse<T>(message: string, data?: Partial<{
    user?: T;
    users?: T[];
    product?: T;
    products?: T[];
}> | null, notification?: INotification | null): ISuccessResponse<T>;
export declare function createErrorResponse(error: string, notification?: INotification | null, additional?: Record<string, any>): IErrorResponse;
//# sourceMappingURL=response.d.ts.map