# Payment Setup Guide

## Razorpay Configuration

The payment system uses Razorpay for processing payments. To enable payments, you need to configure Razorpay credentials.

### Step 1: Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate **Test/Live Key** (use Test keys for development)
4. Copy your **Key ID** and **Key Secret**

### Step 2: Configure Environment Variables

Add these to your `.env` file in the `server` directory:

```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### Step 3: Restart Server

After adding the credentials, restart your server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
# or
node server/src/index.js
```

### Step 4: Verify Setup

1. Check server logs - you should see: `✅ Razorpay initialized successfully`
2. If you see: `⚠️ Razorpay credentials not configured`, check your `.env` file

### Common Issues

#### Error: "Payment gateway not configured"
- **Cause**: Razorpay credentials are missing
- **Solution**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env` file

#### Error: "Database error - payment_orders table does not exist"
- **Cause**: Database migrations not run
- **Solution**: Run the migration:
  ```bash
  cd server
  node run-elearning-migration.js
  ```

#### Error: "Payment gateway error"
- **Cause**: Invalid Razorpay credentials or API issue
- **Solution**: 
  - Verify your Key ID and Key Secret are correct
  - Check if you're using Test keys in test mode
  - Ensure your Razorpay account is active

#### Error: "Invalid amount"
- **Cause**: Amount is not a valid number
- **Solution**: Ensure course price is a valid number (e.g., 999, 1999.99)

### Testing Payments

For testing, use Razorpay's test credentials:
- Test cards: https://razorpay.com/docs/payments/test-cards/
- Test Key ID and Secret from Razorpay Dashboard (Test mode)

### Production Setup

1. Switch to **Live Mode** in Razorpay Dashboard
2. Generate **Live API Keys**
3. Update `.env` with Live credentials
4. Restart server

---

**Note**: Never commit your `.env` file with real credentials to version control!

