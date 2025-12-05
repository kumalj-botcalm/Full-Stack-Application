export interface WelcomeEmailData {
    firstName: string;
    email: string;
    password: string;
    loginUrl: string;
    appName?: string;
}
export declare const welcomeEmailTemplate: (data: WelcomeEmailData) => string;
export declare class EmailTemplates {
    static generateWelcomeEmailHTML(data: WelcomeEmailData): string;
}
//# sourceMappingURL=emailTemplates.d.ts.map