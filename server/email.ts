import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Initialize SendGrid with API key (will be set in production)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailService {
  sendVerificationEmail(email: string, token: string, firstName: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void>;
  sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}

class SendGridEmailService implements EmailService {
  private fromEmail = 'noreply@coinfeedly.com';
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://coinfeedly.com' 
    : 'http://localhost:5000';

  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`Would send verification email to ${email} with token: ${token}`);
      return;
    }

    const verificationUrl = `${this.baseUrl}/verify-email?token=${token}`;
    
    const msg = {
      to: email,
      from: this.fromEmail,
      subject: 'Verify Your CoinFeedly Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">Coin Feedly</h1>
            <p style="color: #6b7280; margin: 5px 0;">Your Trading Journal</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to CoinFeedly, ${firstName}!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Thank you for joining CoinFeedly. To get started with your trading journal, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #f59e0b; word-break: break-all;">${verificationUrl}</a>
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This link will expire in 24 hours for security purposes.
            </p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
  }

  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`Would send password reset email to ${email} with token: ${token}`);
      return;
    }

    const resetUrl = `${this.baseUrl}/reset-password?token=${token}`;
    
    const msg = {
      to: email,
      from: this.fromEmail,
      subject: 'Reset Your CoinFeedly Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">Coin Feedly</h1>
            <p style="color: #6b7280; margin: 5px 0;">Your Trading Journal</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Hi ${firstName}, we received a request to reset your CoinFeedly password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #f59e0b; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              This link will expire in 1 hour for security purposes.<br>
              If you didn't request this reset, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(`Would send welcome email to ${email}`);
      return;
    }

    const msg = {
      to: email,
      from: this.fromEmail,
      subject: 'Welcome to CoinFeedly - Start Your Trading Journey',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">Coin Feedly</h1>
            <p style="color: #6b7280; margin: 5px 0;">Your Trading Journal</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to CoinFeedly, ${firstName}! 🎉</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Your account is now verified and ready to use. CoinFeedly is designed to help you track, analyze, and improve your trading performance.
          </p>
          
          <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Getting Started:</h3>
            <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Log your first trade to start building your performance history</li>
              <li>Use tags and notes to track your trading strategies</li>
              <li>Monitor your progress with detailed analytics and charts</li>
              <li>Set up custom widgets to track what matters most to you</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.baseUrl}/login" 
               style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              Start Trading Journal
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Winners journal. Losers just forget.<br>
              Happy trading!
            </p>
          </div>
        </div>
      `,
    };

    await sgMail.send(msg);
  }
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const emailService: EmailService = new SendGridEmailService();