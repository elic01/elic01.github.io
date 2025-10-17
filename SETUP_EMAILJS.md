# EmailJS Setup Guide

This guide will help you set up EmailJS to enable the contact form on your portfolio website.

## What is EmailJS?

EmailJS allows you to send emails directly from your JavaScript code without needing a backend server. It's perfect for static websites like GitHub Pages.

## Step-by-Step Setup

### 1. Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" (it's free for up to 200 emails/month)
3. Verify your email address

### 2. Add an Email Service

1. Log into your EmailJS dashboard
2. Click on "Email Services" in the left sidebar
3. Click "Add New Service"
4. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - Outlook
   - Yahoo
   - Or use SMTP for custom domains

5. Follow the prompts to connect your email account
6. Note down your **Service ID** (you'll need this later)

### 3. Create an Email Template

1. Click on "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Set up your template with these variables:
   ```
   From: {{name}}
   Email: {{email}}
   Subject: {{subject}}

   Message:
   {{message}}
   ```

4. Customize the template as needed
5. Note down your **Template ID**

### 4. Get Your Public Key

1. Click on "Account" in the left sidebar
2. Go to the "API Keys" tab
3. Copy your **Public Key**

### 5. Update Your Website

1. Open `assets/js/main.js`
2. Find the `CONFIG` object at the top
3. Replace the placeholder values:

```javascript
const CONFIG = {
    emailJS: {
        serviceId: 'YOUR_SERVICE_ID',      // Replace with your Service ID
        templateId: 'YOUR_TEMPLATE_ID',    // Replace with your Template ID
        publicKey: 'YOUR_PUBLIC_KEY'        // Replace with your Public Key
    },
    // ... rest of config
};
```

### 6. Test Your Form

1. Open your website locally or on GitHub Pages
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox for the message

## Example Configuration

Here's what your config should look like after setup:

```javascript
const CONFIG = {
    emailJS: {
        serviceId: 'service_abc1234',
        templateId: 'template_xyz9876',
        publicKey: 'your_public_key_here'
    },
    animations: {
        observerThreshold: 0.1,
        skillAnimationDelay: 100
    }
};
```

## Fallback Option

If EmailJS doesn't load or you prefer not to use it, the form will automatically fall back to opening the user's default email client with pre-filled information.

## Troubleshooting

### Emails Not Sending?

1. **Check the browser console** for error messages
2. **Verify your credentials** are correct in `main.js`
3. **Check your EmailJS quota** (200 emails/month on free plan)
4. **Whitelist your domain** in EmailJS settings (for GitHub Pages: `*.github.io`)

### Testing Locally

EmailJS works on localhost, but make sure:
- You have an internet connection
- Your browser isn't blocking third-party scripts
- Ad blockers aren't interfering

## Security Notes

✅ **Public Key is safe** - It's designed to be public
✅ **Service ID is safe** - It's meant to be in client-side code
✅ **Template ID is safe** - It's publicly accessible

⚠️ Never use your private API key in client-side code!

## Alternative: FormSpree

If you prefer not to use EmailJS, you can also use [FormSpree](https://formspree.io/):

1. Sign up at FormSpree
2. Create a new form
3. Update your form's `action` attribute:
   ```html
   <form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

## Need Help?

- EmailJS Documentation: https://www.emailjs.com/docs/
- Contact me: emmanuelisheanesu2004@gmail.com

---

**Created for Emmanuel Leon Isheanesu Chinjekure's Portfolio**
