# MongoDB Setup Guide

## Problem
You're seeing `ECONNREFUSED` errors because MongoDB is not running or not configured.

## Solution Options

### Option 1: Start Local MongoDB (If Installed)

**On Windows:**
1. Open **Command Prompt or PowerShell as Administrator**
2. Run one of these commands:
   ```powershell
   # Try this first
   net start MongoDB
   
   # Or if installed as a service with different name
   net start MongoDBDB
   
   # Or start manually (if installed in Program Files)
   "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath "C:\data\db"
   ```

**Verify MongoDB is running:**
```powershell
# Check if MongoDB is listening on port 27017
netstat -an | findstr 27017
```

### Option 2: Install MongoDB (If Not Installed)

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows installer (.msi)
   - Run installer and follow instructions

2. **Or Use MongoDB via Docker:**
   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

### Option 3: Use MongoDB Atlas (Cloud - Recommended for Development)

1. **Create a free account:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (M0 tier is free forever)

2. **Create a Cluster:**
   - Click "Create" → Select free tier → Choose a cloud provider and region
   - Wait for cluster to be created (2-3 minutes)

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

4. **Update your `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lexibot?retryWrites=true&w=majority
   ```
   Replace `username`, `password`, and `cluster` with your actual values.

5. **Whitelist IP Address:**
   - In Atlas dashboard, go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your specific IP)

### Option 4: Check Your `.env` File

Make sure you have a `.env` file in the `server/` directory with:

```env
# MongoDB Connection (choose one)
MONGO_URI=mongodb://localhost:27017/lexibot
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lexibot?retryWrites=true&w=majority

# Other required variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000

# Email configuration (if using email features)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM="LexiBot" <no-reply@lexibot.ai>

# Admin creation (optional)
ADMIN_EMAIL=admin@lexibot.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=System Admin
```

## Quick Test

After setting up MongoDB, test the connection:

```powershell
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

Or simply start your server and check if you see "MongoDB Connected Successfully" in the console.

## Troubleshooting

- **"ECONNREFUSED"**: MongoDB is not running → Start MongoDB service
- **"Authentication failed"**: Wrong credentials → Check your connection string
- **"Network timeout"**: Firewall blocking → Check firewall settings or use MongoDB Atlas
- **".env not found"**: Create `.env` file in `server/` directory

## Recommended Setup

For development, **MongoDB Atlas (free tier)** is recommended because:
- ✅ No installation needed
- ✅ Works on any machine
- ✅ Automatic backups
- ✅ Easy to share with team
- ✅ No local setup required

