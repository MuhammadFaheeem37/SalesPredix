# Login Prompt System - Quick Start Guide

## 🚀 System Overview

This is a complete prompt-based login system that sends data to a Flask backend server and displays login activity in real-time logs.

## 📁 Files Created

1. **Backend Server**: `backend/server.py`
   - Flask API server that receives and logs login attempts
   - Runs on http://localhost:5000
   - Stores logs in memory and saves to `data/login_logs.json`

2. **Frontend System**: `vanilla-app/js/loginPrompt.js`
   - Login modal prompt with form validation
   - Sends login data to server
   - Updates activity logs table in real-time
   - Offline mode support

3. **Updated HTML**: `vanilla-app/index.html`
   - Added floating login button
   - Integrated activity logs table
   - Connected login prompt system

## 🎯 How to Use

### Step 1: Start the Backend Server

The server is already running! You should see:

```
============================================================
LOGIN LOGGER SERVER STARTING...
Server Time: 2026-01-23 21:57:15
============================================================

Available endpoints:
  • GET  /              - Server status
  • POST /api/log-login - Submit login attempt
  • GET  /api/get-all-logs - Get all logs
  • GET  /api/get-recent-logs - Get recent logs
  • DELETE /api/clear-logs - Clear logs

Default users:
  • admin@sparklesales.com:admin123
  • user@example.com:password123
  • nazeem@uosahiwal.edu.pk:nazeem123
============================================================

Starting server on http://localhost:5000
```

If you need to restart the server later:
```bash
cd backend
python server.py
```

### Step 2: Open the Frontend Application

1. Navigate to your vanilla-app folder
2. Open `index.html` in your web browser or use Live Server
3. You should see a floating "🔐 Login / Track Activity" button in the bottom-right corner

### Step 3: Test the Login System

1. **Click the "Login / Track Activity" button**
   - A login modal will appear

2. **Enter test credentials**:
   - Email: `admin@sparklesales.com`
   - Password: `admin123`
   
   OR
   - Email: `user@example.com`
   - Password: `password123`
   
   OR
   - Email: `nazeem@uosahiwal.edu.pk`
   - Password: `nazeem123`

3. **Click "Login"**
   - Login data is sent to the server
   - Server validates credentials
   - Activity log is updated in real-time
   - Toast notification appears
   - User badge shows in the UI

### Step 4: View Activity Logs

1. **Frontend Logs**:
   - Activity logs table appears when you click the login button
   - Shows recent login attempts with status badges
   - Updates automatically on each login attempt

2. **Backend Logs**:
   - Check the server terminal for detailed logs
   - Visit http://localhost:5000/api/get-all-logs to see all logs in JSON format
   - Visit http://localhost:5000/api/get-recent-logs for the last 20 logs
   - Logs are also saved to `backend/data/login_logs.json`

## ✨ Key Features

✅ **Server-side logging** - All login attempts are sent to the Flask server
✅ **Real-time updates** - Activity logs update immediately in the UI
✅ **Offline support** - Works even when server is unavailable (stores locally)
✅ **User-friendly prompts** - Clean, modern login interface
✅ **Toast notifications** - Visual feedback for users
✅ **Data persistence** - Logs saved to JSON file and localStorage
✅ **Activity tracking** - Shows in activity logs table with color-coded status
✅ **Easy integration** - Just click the button to start

## 🔧 API Endpoints

### GET /
Server status check
```bash
curl http://localhost:5000/
```

### POST /api/log-login
Submit login attempt
```bash
curl -X POST http://localhost:5000/api/log-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sparklesales.com","password":"admin123"}'
```

### GET /api/get-all-logs
Get all login logs
```bash
curl http://localhost:5000/api/get-all-logs
```

### GET /api/get-recent-logs
Get recent 20 logs
```bash
curl http://localhost:5000/api/get-recent-logs
```

### DELETE /api/clear-logs
Clear all logs (for testing)
```bash
curl -X DELETE http://localhost:5000/api/clear-logs
```

## 🎨 Status Badges

- **SUCCESS** (Green) - Login successful, credentials valid
- **FAILED** (Red) - Invalid credentials
- **OFFLINE** (Yellow) - Server unavailable, using offline mode
- **ERROR** (Blue) - System error occurred

## 🔐 Default Test Credentials

| Email | Password |
|-------|----------|
| admin@sparklesales.com | admin123 |
| user@example.com | password123 |
| nazeem@uosahiwal.edu.pk | nazeem123 |

## 📊 Data Logged

Each login attempt records:
- Log ID (unique identifier)
- Email address
- Username (extracted from email)
- Timestamp
- IP address
- User agent (browser info)
- Platform
- Screen resolution
- Language
- Timezone
- Success/failure status

## 🛠️ Troubleshooting

### Server Not Running?
```bash
cd backend
python server.py
```

### Can't Connect to Server?
- Check if port 5000 is available
- Make sure Flask and Flask-CORS are installed:
  ```bash
  pip install flask flask-cors
  ```

### Offline Mode Activated?
- The system automatically switches to offline mode if server is unavailable
- Logs are saved to browser localStorage
- Yellow "OFFLINE" badges will appear

### Activity Logs Not Showing?
- Make sure the login button has been clicked at least once
- Check browser console for errors (F12)
- The activity logs section appears when you click the login button

## 📝 Customization

### Change Server URL
Edit `vanilla-app/js/loginPrompt.js`:
```javascript
window.loginPrompt = new LoginPromptSystem({
    serverUrl: 'http://your-server-url:5000',
    autoShow: false,
    enableOffline: true
});
```

### Add More Users
Edit `backend/server.py`:
```python
USER_CREDENTIALS = {
    "admin@sparklesales.com": "admin123",
    "user@example.com": "password123",
    "your.email@example.com": "yourpassword"
}
```

### Auto-show Login on Page Load
Edit `vanilla-app/js/loginPrompt.js`:
```javascript
window.loginPrompt = new LoginPromptSystem({
    serverUrl: 'http://localhost:5000',
    autoShow: true,  // Change to true
    enableOffline: true
});
```

## 🎯 Next Steps

1. ✅ Server is running at http://localhost:5000
2. ✅ Frontend is ready at vanilla-app/index.html
3. ✅ Click the "Login / Track Activity" button to test
4. ✅ View logs in the activity table or at http://localhost:5000/api/get-all-logs

## 💡 Console Commands

Open browser console (F12) and try:
```javascript
// Show login prompt
window.loginPrompt.triggerLogin()

// Check server logs
window.loginPrompt.checkServerLogs()

// Check if authenticated
console.log(window.loginPrompt.isAuthenticated)

// Get current user
console.log(window.loginPrompt.currentUser)
```

---

**Enjoy your new login tracking system! 🎉**
