import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
  sendRequestNotification: async (form, user) => {
    // Check if EmailJS is configured
    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS is not fully configured in your .env file. Skipping email send.');
      return;
    }

    const messageContent = `
Patient Name: ${form.patientName}
Blood Type Needed: ${form.bloodType}
Units Needed: ${form.units}
Hospital: ${form.hospital}
Urgency Level: ${form.urgency}
Contact Phone: ${form.contactPhone}
Notes: ${form.notes || 'None'}
    `.trim();

    const templateParams = {
      title: `Urgent Blood Request for ${form.patientName} (${form.bloodType})`,
      name: user?.fullName || form.patientName,
      email: user?.email || '',
      time: new Date().toLocaleString(),
      message: messageContent,
    };

    try {
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log('EmailJS response status:', response.status, response.text);
      return response;
    } catch (error) {
      console.error('Failed to send email via EmailJS:', error);
      throw error;
    }
  }
};
