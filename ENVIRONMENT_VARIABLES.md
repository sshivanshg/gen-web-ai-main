# Environment Variables Required for Render Backend

Your backend is failing because the following environment variables are NOT SET in Render:

## Required Environment Variables

Go to **https://dashboard.render.com** → Select **gen-web-ai-backend** → Settings → Environment:

Add these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `STRIPE_SECRET_KEY` | your-stripe-secret-key | Stripe API secret key from https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | your-webhook-secret | Stripe webhook signing secret |
| `MONGO_URI` | mongodb+srv://... | MongoDB Atlas connection string |
| `JWT_SECRET` | your-random-secret | Any random string for JWT signing (e.g., `openssl rand -base64 32`) |
| `ANTHROPIC_API_KEY` | sk-ant-... | Anthropic Claude API key from https://console.anthropic.com |
| `FRONTEND_URL` | https://aiwebgen-ecru.vercel.app | Your Vercel frontend URL |

## How to Set Them

1. Go to **https://dashboard.render.com**
2. Click on **gen-web-ai-backend** service
3. Scroll down to **Environment** section
4. Click **Add Environment Variable**
5. Fill in each variable above
6. Click **Save** (this will automatically redeploy)

## Getting API Keys

### Stripe Secret Key
- Go to https://dashboard.stripe.com/apikeys
- Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

### Anthropic API Key
- Go to https://console.anthropic.com/account/keys
- Create or copy your API key (starts with `sk-ant-`)

### MongoDB URI
- Go to https://cloud.mongodb.com
- Connect to your cluster
- Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### JWT Secret
Run this to generate a random secret:
```bash
openssl rand -base64 32
```

## After Setting Variables

The backend will automatically redeploy and should start successfully! ✅
