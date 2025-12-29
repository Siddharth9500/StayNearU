import express from 'express';
import nodemailer from 'nodemailer';
import { authenticateToken } from '../middleware/auth.js';
import Property from '../models/Property.js';

const router = express.Router();

// Send Inquiry Email
router.post('/send-inquiry', authenticateToken, async (req, res) => {
  try {
    const {
      property_id,
      message,
      inquiry_type,
      phone,
      preferred_contact_time
    } = req.body;

    // Verify property exists
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Create email transporter (configure with your email settings)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const inquiryTypes = {
      general: 'General Inquiry',
      visit: 'Property Visit Request',
      booking: 'Booking Inquiry',
      pricing: 'Pricing Details',
      facilities: 'Facilities Information'
    };

    const emailBody = `
Dear ${property.owner_name},

You have received a new inquiry for your property: ${property.title}

Student Details:
Name: ${req.user.full_name}
Email: ${req.user.email}
Phone: ${phone || 'Not provided'}
Inquiry Type: ${inquiryTypes[inquiry_type] || inquiry_type}
Preferred Contact Time: ${preferred_contact_time}

Message:
${message}

Property Details:
Title: ${property.title}
Location: ${property.address}, ${property.city}
Rent: ₹${property.rent_amount?.toLocaleString()}/${property.rent_type}

Please respond to the student directly at ${req.user.email} or ${phone}.

Best regards,
StayNearU Team
    `;

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: property.owner_email,
      subject: `New Inquiry: ${property.title}`,
      html: emailBody
    });

    res.status(200).json({ message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send inquiry' });
  }
});

// Contact Support
router.post('/support', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailBody = `
Support Request from: ${name}
Email: ${email}

Message:
${message}
    `;

    await transporter.sendMail({
      from: email,
      to: process.env.SENDER_EMAIL,
      subject: subject || 'Support Request',
      html: emailBody
    });

    res.status(200).json({ message: 'Support request sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send support request' });
  }
});

export default router;
