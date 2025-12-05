"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = exports.welcomeEmailTemplate = void 0;
const welcomeEmailTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Welcome to BotCalm</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .credentials { background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0; }
              .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
              .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to ${data.appName || 'BotCalm'}!</h1>
              </div>
              
              <div class="content">
                  <p>Dear ${data.firstName},</p>
                  
                  <p>Welcome to ${data.appName || 'BotCalm'}! Your account has been successfully created. Below are your login credentials:</p>
                  
                  <div class="credentials">
                      <h3>Your Login Credentials:</h3>
                      <p><strong>Email:</strong> ${data.email}</p>
                      <p><strong>Password:</strong> <code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px;">${data.password}</code></p>
                  </div>
                  
                  <div class="warning">
                      <p><strong>⚠️ Important Security Notice:</strong></p>
                      <p>For your security, please change this password after your first login. You can update your password in your account settings.</p>
                  </div>
                  
                  <p>Click the button below to access your account:</p>
                  <a href="${data.loginUrl}" class="button">Login to Your Account</a>
                  
                  <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                  
                  <p>Best regards,<br>
                  The ${data.appName || 'BotCalm'} Team</p>
              </div>
              
              <div class="footer">
                  <p>This email was sent to ${data.email}. If you did not create this account, please contact us immediately.</p>
              </div>
          </div>
      </body>
      </html>
    `;
};
exports.welcomeEmailTemplate = welcomeEmailTemplate;
class EmailTemplates {
    static generateWelcomeEmailHTML(data) {
        return (0, exports.welcomeEmailTemplate)(data);
    }
}
exports.EmailTemplates = EmailTemplates;
//# sourceMappingURL=emailTemplates.js.map