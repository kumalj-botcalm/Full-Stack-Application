import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/customUi/form-input';
import { FormTextarea } from '@/components/customUi/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InquirySchema, type InquiryFormData } from '@/schema';
import { useEmailJS } from '@/components/emailjs';
import { toast } from 'sonner';


const InquiryPage: React.FC = () => {
  // Initialize the EmailJS hook with custom options
  const { 
    sendGeneralEmail, 
    isLoading
  } = useEmailJS({
    successMessage: '',
    errorMessage: 'Failed to send inquiry. Please try again or contact us directly.',
    onSuccess: () => {}
  });

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(InquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
      const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID;

      // Admin notification parameters
      const adminParams = {
        from_name: data.name,
        from_email: data.email,
        phone_number: data.phoneNumber,
        subject: data.subject,
        message: data.message,
        reply_to: data.email,
        to_email: 'kumal.j@botcalm.com',
        inquiry_date: new Date().toLocaleString(),
      };

      // Auto-reply parameters
      const autoReplyParams = {
        to_name: data.name,
        to_email: data.email,
        subject: data.subject,
        original_message: data.message,
      };

      // Send both emails
      await Promise.all([
        sendGeneralEmail(adminTemplateId, adminParams),
        sendGeneralEmail(autoReplyTemplateId, autoReplyParams)
      ]);
      
      // Show success message and reset form
      toast.success('Your inquiry has been sent successfully! We will get back to you soon. Please check your email for confirmation.');
      form.reset();
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  return (
    <div className="container mx-auto  px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have a question or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
  

          {/* Inquiry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="subject"
                    label="Subject"
                    placeholder="What is your inquiry about?"
                    required
                  />

                  <FormTextarea
                    control={form.control}
                    name="message"
                    label="Message"
                    placeholder="Please describe your inquiry in detail..."
                    rows={5}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;