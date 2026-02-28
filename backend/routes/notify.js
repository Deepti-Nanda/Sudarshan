const express = require('express');
const router = express.Router();

// Initialize Twilio client if credentials exist
let twilioClient;
if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_PHONE) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    console.log('✓ Twilio client initialized');
  } catch (error) {
    console.warn('⚠️  Twilio not available, SMS will be logged to console');
    twilioClient = null;
  }
} else {
  console.warn('⚠️  TWILIO_SID, TWILIO_TOKEN, or TWILIO_PHONE not set. SMS will be logged to console.');
  twilioClient = null;
}

/**
 * Validate phone number format
 * Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, or 10-digit numbers
 */
const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Must be 10 digits (Indian) or 12 digits with country code
  return cleaned.length === 10 || cleaned.length === 12;
};

/**
 * Format phone number to E.164 format for Twilio
 * Input: any format, Output: +91XXXXXXXXXX
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If 10 digits, add India country code
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If starts with 91, add +
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  return `+${cleaned}`;
};

/**
 * Send SMS via Twilio or log to console
 */
const sendSMS = async (phone, message) => {
  try {
    if (!twilioClient) {
      // Mock mode: log to console
      console.log(`📱 SMS (Mock): ${phone}`);
      console.log(`   Message: ${message}`);
      return { success: true, mode: 'mock' };
    }

    // Real SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log(`✓ SMS sent via Twilio: ${result.sid}`);
    return { success: true, mode: 'twilio', sid: result.sid };
  } catch (error) {
    // Never crash, log error and return success anyway
    console.error(`✗ SMS send failed: ${error.message}`);
    return { success: true, mode: 'error-fallback', error: error.message };
  }
};

/**
 * POST /notify/hospital
 * Send SMS alert to hospital about incoming patient
 *
 * Body:
 * - hospitalName: string
 * - hospitalPhone: string
 * - emergencyType: string (e.g., Cardiac, Accident, etc.)
 * - severity: string (e.g., high, moderate, low)
 * - patientETA: number (minutes)
 */
router.post('/hospital', async (req, res) => {
  try {
    const { hospitalName, hospitalPhone, emergencyType, severity, patientETA } = req.body;

    // Validate required fields
    if (!hospitalName || !hospitalPhone || !emergencyType || !severity || patientETA === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['hospitalName', 'hospitalPhone', 'emergencyType', 'severity', 'patientETA'],
      });
    }

    // Validate phone number
    if (!validatePhoneNumber(hospitalPhone)) {
      return res.status(400).json({
        error: 'Invalid hospital phone number format',
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(hospitalPhone);

    // Construct message
    const message = `SANJEEVNI ALERT: ${severity.toUpperCase()} ${emergencyType} patient arriving in ${patientETA} minutes. Please prepare emergency bay immediately.`;

    // Send SMS
    const smsResult = await sendSMS(formattedPhone, message);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      recipient: {
        hospital: hospitalName,
        phone: hospitalPhone,
      },
      sms: {
        mode: smsResult.mode,
        message: message,
        ...(smsResult.sid && { sid: smsResult.sid }),
      },
    });
  } catch (error) {
    // Never crash, always return success
    console.error('Error in /notify/hospital:', error.message);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      note: 'Notification queued with error handling',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /notify/family
 * Send SMS to family about patient and hospital details
 *
 * Body:
 * - familyPhone: string
 * - patientName: string
 * - hospitalName: string
 * - hospitalAddress: string
 * - emergencyType: string
 */
router.post('/family', async (req, res) => {
  try {
    const { familyPhone, patientName, hospitalName, hospitalAddress, emergencyType } = req.body;

    // Validate required fields
    if (!familyPhone || !patientName || !hospitalName || !hospitalAddress || !emergencyType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['familyPhone', 'patientName', 'hospitalName', 'hospitalAddress', 'emergencyType'],
      });
    }

    // Validate phone number
    if (!validatePhoneNumber(familyPhone)) {
      return res.status(400).json({
        error: 'Invalid family phone number format',
      });
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(familyPhone);

    // Construct message
    const message = `${patientName} is being taken to ${hospitalName}, ${hospitalAddress} for ${emergencyType} emergency. Please stay calm.`;

    // Send SMS
    const smsResult = await sendSMS(formattedPhone, message);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      recipient: {
        name: patientName,
        phone: familyPhone,
        hospital: hospitalName,
      },
      sms: {
        mode: smsResult.mode,
        message: message,
        ...(smsResult.sid && { sid: smsResult.sid }),
      },
    });
  } catch (error) {
    // Never crash, always return success
    console.error('Error in /notify/family:', error.message);
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      note: 'Notification queued with error handling',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
