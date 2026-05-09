# Sparkle Sales Backend - Flask + SQLAlchemy

Complete backend API with admin panel for the Sparkle Sales Buddy application.

## 🚀 Features

- **RESTful API** - Complete CRUD operations
- **Authentication** - Login/Register with Flask-Login
- **Admin Panel** - Full-featured admin dashboard
- **Database** - SQLAlchemy with SQLite
- **Security** - Password hashing with Bcrypt
- **CORS** - Cross-origin support for frontend
- **Analytics** - KPIs, trends, and insights endpoints

## 📁 Project Structure

```
backend/
├── app.py                  # Main Flask application
├── models.py               # Database models
├── admin_panel.py          # Flask-Admin configuration
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── routes/
│   ├── auth.py            # Authentication endpoints
│   ├── sales.py           # Sales data endpoints
│   └── analytics.py       # Analytics endpoints
└── templates/
    └── admin/
        └── custom_index.html  # Custom admin dashboard
```

## 🔧 Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Edit `.env` file:
```
SECRET_KEY=your-secret-key-here
DATABASE_URI=sqlite:///sparkle_sales.db
FLASK_ENV=development
```

### 3. Run the Server

```bash
python app.py
```

Server will start at: `http://localhost:5000`

## 🔐 Default Credentials

**Admin Account:**
- Email: `admin@sparklesales.com`
- Password: `admin123`

**Demo User:**
- Email: `demo@example.com`
- Password: `demo123`

## 📡 API Endpoints

### Authentication (`/api/auth`)

```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
POST   /api/auth/logout           - Logout user
GET    /api/auth/me               - Get current user
GET    /api/auth/users            - Get all users (Admin)
DELETE /api/auth/users/:id        - Delete user (Admin)
POST   /api/auth/change-password  - Change password
```

### Sales Data (`/api/sales`)

```
GET    /api/sales                 - Get all sales data (paginated)
POST   /api/sales/upload          - Upload sales data (CSV/JSON)
GET    /api/sales/:id             - Get specific sales item
PUT    /api/sales/:id             - Update sales item
DELETE /api/sales/:id             - Delete sales item
DELETE /api/sales/clear           - Clear all user's sales data
GET    /api/sales/categories      - Get unique categories
GET    /api/sales/regions         - Get unique regions
```

### Analytics (`/api/analytics`)

```
GET    /api/analytics/kpis                - Get KPI metrics
GET    /api/analytics/monthly-trends      - Get monthly trends
GET    /api/analytics/category-breakdown  - Get category breakdown
GET    /api/analytics/top-products        - Get top products
GET    /api/analytics/region-data         - Get regional data
GET    /api/analytics/dashboard           - Get all dashboard data
```

## 🎨 Admin Panel

Access at: `http://localhost:5000/admin`

### Features:
- **Users Management** - View, edit, delete users
- **Sales Data Management** - CRUD operations on sales records
- **Activity Logs** - Track all admin actions
- **Dashboard** - Overview statistics and quick actions
- **Search & Filter** - Advanced filtering on all tables
- **Bulk Operations** - Batch actions on records

### Admin Capabilities:
- Create/Edit/Delete users
- Toggle admin privileges
- View all sales data across users
- Monitor system activity
- Export data
- View statistics and reports

## 💾 Database Models

### User
```python
- id (Integer, Primary Key)
- name (String)
- email (String, Unique)
- password_hash (String)
- is_admin (Boolean)
- created_at (DateTime)
- last_login (DateTime)
```

### SalesData
```python
- id (Integer, Primary Key)
- user_id (Foreign Key)
- date (Date)
- product (String)
- category (String)
- region (String)
- quantity (Integer)
- revenue (Float)
- cost (Float)
- profit (Float)
- created_at (DateTime)
- updated_at (DateTime)
```

### AdminLog
```python
- id (Integer, Primary Key)
- admin_id (Foreign Key)
- action (String)
- details (Text)
- ip_address (String)
- timestamp (DateTime)
```

## 🔒 Security Features

- Password hashing with Bcrypt
- Session-based authentication
- CSRF protection
- SQL injection prevention (SQLAlchemy ORM)
- Admin-only routes protection
- Activity logging for audit trail

## 📤 CSV Upload Format

```csv
date,product,category,region,quantity,revenue,cost
2024-01-15,Premium Laptop Pro,Electronics,North America,2,2598,1688
2024-01-16,Office Chair Deluxe,Furniture,Europe,1,549,357
```

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt

# Get KPIs (with session)
curl -X GET http://localhost:5000/api/analytics/kpis \
  -b cookies.txt
```

### Using Python

```python
import requests

# Login
response = requests.post('http://localhost:5000/api/auth/login', json={
    'email': 'demo@example.com',
    'password': 'demo123'
})

# Get data
session = requests.Session()
data = session.get('http://localhost:5000/api/analytics/dashboard')
print(data.json())
```

## 🔄 Integrating with Frontend

Update your vanilla JavaScript app to use the backend:

```javascript
// In vanilla-app/js/auth.js
async login(email, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({email, password})
    });
    return await response.json();
}
```

## 📊 Sample Data Generation

To populate with sample data:

```python
from app import create_app, db
from models import User, SalesData
from datetime import datetime, timedelta
import random

app = create_app()
with app.app_context():
    user = User.query.first()
    products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor']
    
    for i in range(100):
        sale = SalesData(
            user_id=user.id,
            date=datetime.now() - timedelta(days=random.randint(1, 180)),
            product=random.choice(products),
            category='Electronics',
            region='North America',
            quantity=random.randint(1, 5),
            revenue=random.uniform(100, 2000),
            cost=random.uniform(50, 1000),
            profit=0
        )
        sale.profit = sale.revenue - sale.cost
        db.session.add(sale)
    
    db.session.commit()
    print("Sample data created!")
```

## 🐛 Troubleshooting

**Database locked error:**
```bash
rm sparkle_sales.db
python app.py  # Will recreate database
```

**CORS errors:**
- Ensure Flask-CORS is installed
- Check frontend origin in CORS configuration

**Import errors:**
```bash
pip install -r requirements.txt --force-reinstall
```

## 📝 Environment Variables

```
SECRET_KEY          - Flask secret key for sessions
DATABASE_URI        - Database connection string
FLASK_ENV           - development/production
FLASK_DEBUG         - True/False
```

## 🚀 Production Deployment

For production:
1. Change `SECRET_KEY` to a secure random value
2. Use PostgreSQL instead of SQLite
3. Set `FLASK_ENV=production`
4. Use Gunicorn: `gunicorn app:app`
5. Setup HTTPS
6. Configure proper CORS origins
7. Add rate limiting
8. Setup logging

## 📞 Support

Backend running at: `http://localhost:5000`
Admin Panel: `http://localhost:5000/admin`

---

**Backend Ready! 🎉**

Your Flask backend with admin panel is complete and ready to use!
