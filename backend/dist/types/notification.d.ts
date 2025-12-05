import { IUser, IProduct } from './database';
export declare enum NotificationTypes {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info"
}
export interface INotification {
    type: NotificationTypes;
    title: string;
    message: string;
    details: string;
}
export declare function createNotification(type: NotificationTypes, title: string, message: string, details: string): INotification;
export declare class NotificationTemplates {
    static readonly USER: {
        CREATED: (user: IUser) => INotification;
        UPDATED: (user: IUser) => INotification;
        DELETED: (user: IUser) => INotification;
        NOT_FOUND: () => INotification;
        DUPLICATE_EMAIL: (email: string) => INotification;
        EMAIL_CONFLICT: () => INotification;
        VALIDATION_ERROR: () => INotification;
        SERVER_ERROR: (action: string) => INotification;
    };
    static readonly PRODUCT: {
        CREATED: (product: IProduct) => INotification;
        UPDATED: (product: IProduct) => INotification;
        DELETED: (product: IProduct) => INotification;
        NOT_FOUND: () => INotification;
        VALIDATION_ERROR: () => INotification;
        SERVER_ERROR: (action: string) => INotification;
    };
}
//# sourceMappingURL=notification.d.ts.map