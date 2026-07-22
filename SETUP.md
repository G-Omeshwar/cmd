# Installation & Setup Guide

## Quick Start - Local Development

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/G-Omeshwar/cmd.git
cd cmd
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=erp_crm_db
# DB_USER=postgres
# DB_PASSWORD=postgres
```

### Step 3: Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE erp_crm_db;"

# Run migrations and seed
cd backend
npm run migrate
```

### Step 4: Start Backend
```bash
cd backend
npm run dev

# Server runs on http://localhost:5000
```

### Step 5: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add API URL (should already be set)
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" >> .env
```

### Step 6: Start Frontend
```bash
cd frontend
npm start

# App runs on http://localhost:3000
```

## Docker Setup (Optional)

### Prerequisites
- Docker
- Docker Compose

### Run with Docker
```bash
cd cmd

# Build and start all services
docker-compose up --build

# Runs:
# - PostgreSQL on localhost:5432
# - Backend on localhost:5000
# - Frontend on localhost:3000

# Stop services
docker-compose down
```

## Test Login

Once running, login with these credentials:

### Admin User
- **Email**: admin@company.com
- **Password**: admin123

### Sales User
- **Email**: sales@company.com
- **Password**: sales123

### Warehouse User
- **Email**: warehouse@company.com
- **Password**: warehouse123

### Accounts User
- **Email**: accounts@company.com
- **Password**: accounts123

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
sudo systemctl start postgresql

# Check connection
psql -U postgres -d erp_crm_db
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm cache clean --force
npm install
```

### Port 5000/3000 Already in Use
Change ports in .env files:
```
# Backend
PORT=5001

# Frontend
PORT=3001
```

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev  # Hot reload enabled
```

### Frontend Development
```bash
cd frontend
npm start   # Hot reload enabled
```

## Building for Production

### Backend Build
```bash
cd backend
npm run build
npm start   # Runs compiled version
```

### Frontend Build
```bash
cd frontend
npm run build
# Output in build/ directory
```

## Database Backup

```bash
# Backup database
pg_dump -U postgres erp_crm_db > backup.sql

# Restore database
psql -U postgres erp_crm_db < backup.sql
```

## Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: See docs/API.md
- **Database**: PostgreSQL on localhost:5432

## Next Steps

1. Review the API documentation in `docs/API.md`
2. Check the database schema in `docs/DATABASE.md`
3. Understand the architecture in `docs/ARCHITECTURE.md`
4. Follow deployment guide in `docs/DEPLOYMENT.md`

## Need Help?

- Check README in `backend/README.md`
- Check README in `frontend/README.md`
- Review API documentation in `docs/API.md`
- Check troubleshooting in `docs/DEPLOYMENT.md`
