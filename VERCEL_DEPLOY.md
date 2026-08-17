# Frontend Deployment to Vercel - Quick Guide

## Your Backend URL
`https://gen-web-ai-main.onrender.com`

## Steps to Deploy Frontend to Vercel

### Option 1: Via GitHub (Recommended)

1. **Push the latest changes to GitHub** (from your machine):
   ```bash
   cd /Users/shivanshgupta/projects/gen-web-ai-main
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose `sshivanshg/gen-web-ai-main`

3. **Configure the Project**
   - **Project Name**: `gen-web-ai-frontend` (or your preference)
   - **Framework**: Select "Vite" (auto-detected)
   - **Root Directory**: Keep as root (monorepo)
   - Click "Edit" next to each field if needed

4. **Build Settings**
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

5. **Environment Variables**
   - Add: `VITE_API_URL` = `https://gen-web-ai-main.onrender.com`

6. **Click "Deploy"** and wait for the build to complete

### Option 2: Using Vercel CLI (Alternative)

If you have Vercel CLI installed:
```bash
cd /Users/shivanshgupta/projects/gen-web-ai-main
vercel --prod --env VITE_API_URL=https://gen-web-ai-main.onrender.com
```

## After Deployment

1. Vercel will give you a production URL (e.g., `gen-web-ai-frontend.vercel.app`)
2. Update your backend's CORS configuration in Render:
   - Go to Render Dashboard → Select `gen-web-ai-backend`
   - Settings → Environment
   - Update `FRONTEND_URL` = your new Vercel URL

## Test the Connection

After deployment:
- Open your Vercel URL
- Try creating a project or accessing dashboard
- Check browser DevTools Console for any CORS errors
- If errors, verify `VITE_API_URL` is set correctly

## Environment Variable Checklist

- ✅ Backend: `https://gen-web-ai-main.onrender.com`
- ✅ Frontend VITE_API_URL: `https://gen-web-ai-main.onrender.com`
- ✅ Backend FRONTEND_URL: Update to your Vercel URL after deployment
