const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const { getIO } = require('../socket');

// SendGrid email helper (line 9)
const sendEmail = async ({ to, subject, html, from = 'noreply@vellumtrade.com', replyTo }) => {
  try {
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: 'Vellumtrade Support' },
        subject: subject,
        content: [{ type: 'text/html', value: html }],
        ...(replyTo && { reply_to: { email: replyTo } }),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Support email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Send email error:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================================================
// POST /api/support/contact - CONTACT FORM WITH SUBJECT
// ============================================================================
router.post('/contact', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('subjectLabel').notEmpty().withMessage('Subject label is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, name, email, subject, subjectLabel, message } = req.body;

    // Save to chat history with hiddenFromUser flag (admin can see, user cannot)
    await ChatMessage.create({
      userId,
      sender: 'user',
      message: message,
      userEmail: email,
      userName: name,
      source: 'contact_form',
      hiddenFromUser: true
    });

    // Send email to admin with subject in header
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'cybox5050@gmail.com',
      subject: `[${subjectLabel}] New Support Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">${subjectLabel}</h2>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>User:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; color: #4b5563;"><strong>User ID:</strong> ${userId}</p>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 20px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 Reply via admin dashboard or email to respond to user.
              </p>
            </div>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
            Vellumtrade Support System • ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'Message sent to admin' });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// POST /api/support/chat-message - USER SENDS MESSAGE (line 35)
router.post('/chat-message', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userId, name, email, message } = req.body;

    // Parse subject category from message (e.g., [DEPOSIT] I need help...)
    const subjectMatch = message.match(/^\[([A-Z_]+)\]\s*(.+)$/);
    const cleanMessage = subjectMatch ? subjectMatch[2] : message;
    const category = subjectMatch ? subjectMatch[1] : 'CHAT';
    
    // Format category for display
    const categoryDisplay = {
      'DEPOSIT': '💰 Deposit Issue',
      'WITHDRAWAL': '💸 Withdrawal Issue',
      'ACCOUNT': '👤 Account Problem',
      'TECHNICAL': '🔧 Technical Support',
      'GENERAL': '❓ General Inquiry',
      'CHAT': '💬 Chat Message'
    }[category] || `📋 ${category}`;

    const chatMsg = await ChatMessage.create({
      userId,
      sender: 'user',
      message: cleanMessage,
      userEmail: email,
      userName: name,
      source: 'chat',
      category: category.toLowerCase()
    });

    const replyToAddress = `chat-reply-${userId}@chat.vellumtrade.com`;

    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'cybox5050@gmail.com',
      subject: `${categoryDisplay} from ${name} (ID: ${userId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px;">${categoryDisplay}</h2>
            
            <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>User:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0; color: #4b5563;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; color: #4b5563;"><strong>User ID:</strong> ${userId}</p>
            </div>

            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 20px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                📧 <strong>Reply to this email</strong> to respond directly to the user.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                Reply-To: ${replyToAddress}
              </p>
            </div>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
            Vellumtrade Support System • ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      replyTo: replyToAddress
    });

    res.json({ success: true, message: 'Message sent', data: chatMsg });
  } catch (error) {
    console.error('Chat message error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// GET /api/support/chat-history - FILTER OUT HIDDEN MESSAGES
router.get('/chat-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await ChatMessage.find({ 
      userId,
      hiddenFromUser: { $ne: true }  // Only show messages NOT hidden from user
    })
      .sort({ createdAt: 1 })
      .limit(50);
    
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// CLEAN EMAIL REPLY - Remove quoted text and signatures
// ============================================================================
const cleanEmailReply = (text, html) => {
  let content = text || '';
  
  if (!content && html) {
    content = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }
  
  if (!content) return '';
  
  const quotePatterns = [
    /\nOn\s+[\w,]+\s+\d{1,2}\s+\w+\s+\d{4}\s+at\s+\d{1,2}:\d{2},?\s+[\w\s]+\s+<[^>]+>\s*wrote:.*$/is,
    /\n-{3,}Original Message-{3,}.*$/is,
    /\n>.*$/is,
    /\nFrom:\s*.*$/is,
    /\nSent from my (iPhone|Android|Mobile).*$/i,
    /\n-{2,}\s*\n.*$/is,
    /Reply to this email to respond directly to the user.*/is,
  ];
  
  quotePatterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('>') && !line.startsWith('On '))
    .join('\n')
    .trim();
};

// MULTIPART PARSER - Handles Sendlib's form-data format
// ============================================================================
const parseMultipartBody = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  
  if (!contentType.includes('multipart/form-data')) {
    return next();
  }

  console.log('📎 Parsing multipart/form-data...');
  
  let rawData = Buffer.from('');
  
  req.on('data', (chunk) => {
    rawData = Buffer.concat([rawData, chunk]);
  });
  
  req.on('end', () => {
    try {
      const body = {};
      const text = rawData.toString('utf8');
      
      const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
      if (!boundaryMatch) {
        req.body = { _raw: text };
        return next();
      }
      
      const boundary = boundaryMatch[1].trim().replace(/^["']|["']$/g, '');
      const parts = text.split(`--${boundary}`);
      
      parts.forEach((part, index) => {
        if (index === 0 || part.trim() === '--' || part.trim() === '') return;
        
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        
        const headers = part.substring(0, headerEnd);
        const content = part.substring(headerEnd + 4).replace(/\r\n$/, '');
        
        const nameMatch = headers.match(/name="([^"]+)"/i);
        if (nameMatch) {
          body[nameMatch[1]] = content;
        }
      });
      
      req.body = body;
      console.log('✅ Multipart parsed. Fields:', Object.keys(body));
      next();
    } catch (error) {
      console.error('❌ Parse error:', error.message);
      req.body = {};
      next();
    }
  });
  
  req.on('error', (error) => {
    console.error('❌ Stream error:', error);
    req.body = {};
    next();
  });
};

// POST /api/support/email-reply - ADMIN REPLIES VIA EMAIL (FIXED)
// ============================================================================
router.post('/email-reply', 
  parseMultipartBody,
  async (req, res) => {
    try {
      const body = req.body || {};
      
      console.log('📧 Email webhook received');
      console.log('Body keys:', Object.keys(body));

      let to = body.to;
      let from = body.from;
      const subject = body.subject;
      const html = body.html;
      const text = body.text;
      
      if (body.envelope) {
        try {
          const parsed = JSON.parse(body.envelope);
          to = to || (Array.isArray(parsed.to) ? parsed.to[0] : parsed.to);
          from = from || parsed.from;
        } catch (e) {}
      }

      console.log('📧 Parsed:', { to, from, subject: subject?.substring(0, 50) });

      if (!to || typeof to !== 'string') {
        console.error('❌ Missing "to" field');
        return res.status(400).send('Invalid reply address');
      }

      const userIdMatch = to.match(/chat-reply-(.+)@/i);
      if (!userIdMatch || !userIdMatch[1]) {
        console.error('❌ Invalid format:', to);
        return res.status(400).send('Invalid reply address format');
      }

      const userId = userIdMatch[1];
      const rawMessage = text || html || '';
      const messageText = cleanEmailReply(text, html);
      
      console.log('📝 Raw length:', rawMessage.length);
      console.log('📝 Cleaned:', messageText);
      
      if (!messageText) {
        console.error('❌ No content after cleaning');
        return res.status(400).send('No message content');
      }

      const reply = await ChatMessage.create({
        userId,
        sender: 'admin',
        message: messageText,
        source: 'email'
      });

      const io = getIO();
      if (io) {
        io.to(userId).emit('admin_reply', {
          id: reply._id,
          sender: 'support',
          text: messageText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        console.log(`✅ Clean reply sent to ${userId}: "${messageText.substring(0, 50)}..."`);
      }

      res.status(200).send('OK');

    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).send('Error processing reply');
    }
  }
);

module.exports = router;