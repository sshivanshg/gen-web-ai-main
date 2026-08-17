# Deployment Guide

## Backend Deployment to Render

### Prerequisites
- Render account (https://render.com)
- MongoDB Atlas account (for database)
- Git repository with this project

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push
   ```

2. **Create MongoDB Atlas Database** (if not already done)
   - Go to https://www.mongodb.com/products/platform/atlas
   - Create a cluster
   - Get your connection string (MONGO_URI)

3. **Deploy to Render**
   - Go to https://render.com/dashboard
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select this project
   - Set the following configuration:
     - **Name**: gen-web-ai-backend
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && node index.js`
     - **Plan**: Free (or paid as needed)

4. **Set Environment Variables in Render**
   Go to the service settings and add these environment variables:
   ```
   PORT=3000
   NODE_ENV=production
   MONGO_URI=<your_mongodb_connection_string>
   DB_NAME=gen-web-ai-db
   JWT_SECRET=<generate_a_random_secret>
   FRONTEND_URL=<your_vercel_frontend_url>
   ANTHROPIC_API_KEY=<your_anthropic_api_key>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
   ```

5. **Update Start Command**
   - After deployment, update the start command to: `cd server && node index.js`
   - Make sure NOT to use `npm run dev` in production (that's for development with nodemon)

## Frontend Deployment to Vercel

### Prerequisites
- Vercel account (https://vercel.com)
- Git repository

### Steps

1. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel should auto-detect it's a Monorepo
   - Set the following:
     - **Project Name**: gen-web-ai-frontend
     - **Framework Preset**: Vite
     - **Build Command**: `cd client && npm install && npm run build`
     - **Output Directory**: `client/dist`
     - **Install Command**: `npm install`

2. **Set Environment Variables in Vercel**
   Go to Settings → Environment Variables and add:
   ```
   VITE_API_URL=<your_render_backend_url>
   ```
   For example: `VITE_API_URL=https://gen-web-ai-backend.onrender.com`

3. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Important Notes

1. **Render Backend URL**: After deployment, Render will provide you with a URL like `https://gen-web-ai-backend.onrender.com`. Use this as your VITE_API_URL in Vercel.

2. **CORS Configuration**: The backend's CORS is configured to accept requests from FRONTEND_URL. Make sure you update this in the Render environment variables.

3. **Stripe Webhooks**: If using Stripe, update your webhook endpoints in Stripe dashboard to point to your Render backend URL.

4. **Database Connection**: Make sure your MongoDB Atlas cluster allows connections from Render's IP addresses. In MongoDB Atlas, add Render's IP to your IP whitelist.

5. **Start Script Fix**: The server/package.json has `"dev": "nodemon index.js"` but needs a production script. Update it:
   ```json
   "scripts": {
     "dev": "nodemon index.js",
     "start": "node index.js"
   }
   ```

## Monitoring

- **Render Logs**: https://render.com/docs/logs
- **Vercel Analytics**: https://vercel.com/docs/concepts/analytics
- **MongoDB Monitoring**: MongoDB Atlas Console

## Troubleshooting

If the backend doesn't deploy:
- Check the build logs in Render
- Verify all environment variables are set
- Make sure PORT is set to 3000
- Check that server/index.js exists and starts correctly

If the frontend can't reach the backend:
- Verify VITE_API_URL is set correctly in Vercel
- Check browser console for CORS errors
- Ensure FRONTEND_URL is set in the backend
