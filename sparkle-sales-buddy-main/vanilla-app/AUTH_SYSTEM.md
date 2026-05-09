# Authentication System - Sparkle Sales Buddy

## Overview

The Sparkle Sales Buddy application now includes a complete authentication system with login and registration pages. All pages except login and registration are protected and require user authentication.

## 🔐 Features

### Login Page
- Email and password authentication
- Persistent sessions using localStorage
- Demo account for testing
- Password validation
- Error messages and toasts

### Register Page
- User registration with name, email, and password
- Password confirmation validation
- Email uniqueness check
- Minimum password length (6 characters)
- Auto-login after registration

### Protected Routes
All application pages require authentication:
- Dashboard
- Upload Data
- Predictions
- Analytics
- AI Assistant
- Achievements
- Settings

### Public Routes
- `/login` - Login page
- `/register` - Registration page

## 🚀 Getting Started

### Demo Account (Pre-loaded)
- **Email:** `demo@example.com`
- **Password:** `demo123`

### Create New Account
1. Click "Create Account" on the login page
2. Fill in name, email, and password
3. Click "Create Account" to register
4. You'll be automatically logged in

## 📁 File Structure

```
vanilla-app/
├── js/
│   ├── auth.js          # Authentication manager
│   ├── app.js           # App initialization with logout
│   ├── router.js        # Updated with auth routing
│   └── pages.js         # Login and register pages added
└── ...
```

## 🔧 Authentication System Details

### AuthManager Class (auth.js)

```javascript
// Create/register new user
authManager.register(email, password, name)

// Login user
authManager.login(email, password)

// Logout current user
authManager.logout()

// Check if user is logged in
authManager.isLoggedIn()

// Get current user
authManager.getUser()

// Subscribe to auth changes
authManager.subscribe(callback)
```

### Router Protection

The router automatically:
- Redirects unauthenticated users to `/login` when accessing protected routes
- Redirects authenticated users away from `/login` and `/register` to `/dashboard`
- Hides sidebar and header for auth pages

### Data Storage

- **Users:** Stored in `localStorage` with key `users` (JSON array)
- **Current User:** Stored in `localStorage` with key `currentUser` (JSON object)
- **Password Security:** Uses simple hashing (NOT production-ready)

## 🎨 UI/UX

### Login Page
- Beautiful gradient background
- Email and password fields
- Demo credentials display
- Link to create account
- Error messages in red

### Register Page
- Beautiful gradient background
- Name, email, password fields
- Password confirmation
- Link to login page
- Security information display

## 🔐 Security Notes

⚠️ **Important:** This implementation uses basic hashing for demonstration purposes only.

For production use, implement:
- bcrypt or similar for password hashing
- JWT tokens for session management
- HTTPS for all communications
- Server-side authentication
- Rate limiting on login attempts
- Account lockout mechanisms

## 📝 Usage Examples

### Check if user is logged in
```javascript
if (authManager.isLoggedIn()) {
    console.log('User:', authManager.getUser());
}
```

### Subscribe to auth changes
```javascript
authManager.subscribe((user) => {
    if (user) {
        console.log('Logged in as:', user.name);
    } else {
        console.log('Logged out');
    }
});
```

### Logout user
```javascript
app.logout(event);
// Or manually:
authManager.logout();
router.navigate('/login');
```

## 🎯 Workflow

1. **First Visit:** User redirected to `/login` page
2. **New User:** Click "Create Account" → Register → Auto-login → Dashboard
3. **Returning User:** Login → Navigate to dashboard
4. **Logout:** Click "Logout" in sidebar → Logged out → Redirected to login

## 🐛 Testing

### Test Case 1: Register New User
1. Open app
2. Click "Create Account"
3. Fill in details
4. Should be logged in and redirected to dashboard

### Test Case 2: Login with Demo Account
1. Open app
2. Enter `demo@example.com` and `demo123`
3. Should be logged in and redirected to dashboard

### Test Case 3: Logout
1. Click "Logout" in sidebar
2. Should be redirected to login page
3. Try accessing `/` directly - should redirect to login

### Test Case 4: Protected Routes
1. Clear localStorage: `localStorage.clear()`
2. Try accessing `/dashboard` directly
3. Should redirect to login page

### Test Case 5: Auto-Redirect When Logged In
1. Login successfully
2. Try accessing `/login` directly
3. Should redirect to dashboard

## 💾 Data Persistence

- User sessions persist across browser refreshes
- Registered users are stored in localStorage
- User data includes: ID, name, email, password hash, creation date
- Clear localStorage to reset all data

## 🎮 Keyboard Shortcuts (After Login)
- `Ctrl/Cmd + H` - Go to Dashboard
- `Ctrl/Cmd + K` - Open AI Assistant
- `Ctrl/Cmd + U` - Upload Data

## 📞 Support

For issues related to authentication:
1. Check browser console for error messages
2. Verify localStorage is enabled
3. Clear browser cache and try again
4. Check localStorage: `console.log(JSON.parse(localStorage.getItem('currentUser')))`

## 🔄 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Account settings
- [ ] Remember me option
- [ ] Session expiration

---

**Authentication System Ready!** 🎉

Your app is now fully protected with login and registration!
