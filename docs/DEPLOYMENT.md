# Deployment Guide

## Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git account
- Accounts on hosting platforms (Vercel, Render, Supabase)

## Step 1: Prepare the Repository

### Clone and Setup
```bash
git clone https://github.com/G-Omeshwar/cmd.git
cd cmd

# Create backend/.env from backend/.env.example
cd backend
cp .env.example .env

# Create frontend/.env from frontend/.env.example
cd ../frontend
cp .env.example .env
```

## Step 2: Deploy Database (Supabase)

### Create Supabase Project
1. Go to https://supabase.com
2. Sign up/Login
3. Create new project
4. Get connection credentials from Settings > Database

### Update Backend .env
```
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
```

### Initialize Database
```bash
cd backend
npm install
npm run migrate
npm run seed
```

## Step 3: Deploy Backend (Render)

### Create Render Web Service
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" > "Web Service"
4. Select your repository
5. Configure:
   - **Name**: erp-crm-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Region**: Choose closest to you

### Add Environment Variables
In Render dashboard, go to Environment:
```
DB_HOST=your-supabase-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
PORT=10000
NODE_ENV=production
JWT_SECRET=your_secure_random_string
JWT_EXPIRY=7d
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Deploy
- Render automatically deploys on git push
- Monitor deployment in Render dashboard
- Get your backend URL: `https://erp-crm-backend.onrender.com`

## Step 4: Deploy Frontend (Vercel)

### Connect to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: ./frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

### Add Environment Variables
In Vercel dashboard, Environment Variables:
```
REACT_APP_API_BASE_URL=https://erp-crm-backend.onrender.com/api
REACT_APP_APP_NAME=ERP CRM Portal
```

### Deploy
- Vercel automatically deploys on git push
- Your frontend URL: `https://erp-crm-portal.vercel.app`

## Step 5: Update Backend CORS

Update backend .env with frontend URL:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

Redeploy backend on Render.

## Step 6: Create Default Users (Database Seed)

### Run Seed Script
```bash
cd backend
npm run seed
```

This creates:
```
Admin: admin@company.com / admin123
Sales: sales@company.com / sales123
Warehouse: warehouse@company.com / warehouse123
Accounts: accounts@company.com / accounts123
```

## Step 7: Testing

### Test Backend
```bash
# Check if API is running
curl https://erp-crm-backend.onrender.com/health

# Test login
curl -X POST https://erp-crm-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'
```

### Test Frontend
- Open https://your-frontend.vercel.app
- Login with test credentials
- Navigate through modules

## Step 8: Monitoring & Maintenance

### Health Checks
- Backend: Monitor Render dashboard
- Database: Check Supabase dashboard
- Frontend: Check Vercel analytics

### Error Logging
- Check Render logs: `Logs` tab
- Check browser console for frontend errors
- Monitor database performance in Supabase

## Local Development Setup

### Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Setup PostgreSQL locally
# Update DB credentials in .env

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update API base URL in .env
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" >> .env

# Start development server
npm start

# App runs on http://localhost:3000
```

## Alternative: Railway Deployment

### Deploy Backend on Railway
1. Go to https://railway.app
2. Connect GitHub account
3. Create new project
4. Select repository
5. Add PostgreSQL plugin
6. Deploy

### Deploy Frontend on Railway
1. Create new service
2. Connect GitHub
3. Select repository
4. Set start command: `cd frontend && npm run build && npm install -g serve && serve -s build`

## Troubleshooting

### Database Connection Error
```
Error: Cannot find module 'pg'
Fix: npm install pg

Error: Connection refused
Fix: Check DB_HOST, DB_PORT, and credentials in .env
```

### CORS Error in Frontend
```
Error: Access to XMLHttpRequest blocked by CORS
Fix: Update CORS_ORIGIN in backend .env and redeploy
```

### JWT Token Invalid
```
Error: Invalid token
Fix: Check JWT_SECRET is same in all instances
      Check token expiry time
```

### Build Fails
```
Fix: Clear cache: npm cache clean --force
     Delete node_modules: rm -rf node_modules
     Reinstall: npm install
```

## Performance Optimization

1. **Enable Compression**: Already configured in Express
2. **Database Indexes**: Created in migration
3. **Frontend Caching**: Configure in Vercel
4. **API Rate Limiting**: Add express-rate-limit (optional)

## Security Checklist

- [ ] JWT_SECRET is strong and random
- [ ] Passwords are hashed with bcrypt
- [ ] CORS restricted to frontend domain
- [ ] Environment variables not in git
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Database credentials not exposed
- [ ] Input validation on all endpoints

## Maintenance

### Regular Tasks
- Monitor application logs weekly
- Check database size and cleanup
- Update dependencies monthly
- Review user activity
- Backup database regularly

### Scaling
- Upgrade Render tier if needed
- Optimize database queries
- Add caching layer (Redis)
- Split services if needed

## Rollback Procedure

### Revert on Render
1. Go to Deployment History
2. Click on previous stable deployment
3. Click "Redeploy"

### Revert on Vercel
1. Go to Deployments
2. Click on previous deployment
3. Click "Promote to Production"

## Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev
