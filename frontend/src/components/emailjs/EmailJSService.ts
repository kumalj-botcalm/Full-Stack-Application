import emailjs from '@emailjs/browser';

export interface EmailParams {
  [key: string]: any;
}

/**
 * Simple EmailJS service for sending emails
 */
export class EmailJSService {
  private serviceId: string;
  private publicKey: string;

  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  }

  //Send a single email using EmailJS
  
  async sendEmail(templateId: string, templateParams: EmailParams) {
    if (!this.publicKey || !templateId) {
      throw new Error('EmailJS configuration is missing');
    }

    return await emailjs.send(
      this.serviceId,
      templateId,
      templateParams,
      this.publicKey
    );
  }
 //General email function - send email with template and parameters
   
  async sendGeneralEmail(templateId: string, params: EmailParams) {
    if (!templateId) {
      throw new Error('Template ID is required');
    }
    return await this.sendEmail(templateId, params);
  }
}
// Export singleton instance
export const emailJSService = new EmailJSService();
