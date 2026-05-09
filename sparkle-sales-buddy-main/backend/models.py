from extensions import db, bcrypt
from datetime import datetime
from flask_login import UserMixin

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    sales_data = db.relationship('SalesData', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches the hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'


class SalesData(db.Model):
    __tablename__ = 'sales_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Sales information
    date = db.Column(db.Date, nullable=False, index=True)
    product = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False, index=True)
    region = db.Column(db.String(100), nullable=False, index=True)
    
    # Financial data
    quantity = db.Column(db.Integer, nullable=False)
    revenue = db.Column(db.Float, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    profit = db.Column(db.Float, nullable=False)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert sales data object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'product': self.product,
            'category': self.category,
            'region': self.region,
            'quantity': self.quantity,
            'revenue': self.revenue,
            'cost': self.cost,
            'profit': self.profit,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<SalesData {self.product} - {self.date}>'


class AdminLog(db.Model):
    __tablename__ = 'admin_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    details = db.Column(db.Text)
    ip_address = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    admin = db.relationship('User', foreign_keys=[admin_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'admin_email': self.admin.email if self.admin else None,
            'action': self.action,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }
    
    def __repr__(self):
        return f'<AdminLog {self.action} by {self.admin_id}>'


class LoginActivity(db.Model):
    """Track all login attempts (successful and failed)"""
    __tablename__ = 'login_activity'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, index=True)
    username = db.Column(db.String(100))
    status = db.Column(db.String(20), nullable=False, index=True)  # SUCCESS, FAILED, OFFLINE_SUCCESS, OFFLINE_FAILED
    action = db.Column(db.String(100), default='LOGIN_ATTEMPT')
    
    # Request details
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.Text)
    platform = db.Column(db.String(50))
    screen_resolution = db.Column(db.String(20))
    language = db.Column(db.String(10))
    timezone = db.Column(db.String(50))
    
    # Timestamps
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Link to user if exists
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user = db.relationship('User', backref='login_activities', foreign_keys=[user_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'log_id': f'#LOG{self.id}',
            'email': self.email,
            'username': self.username or self.email.split('@')[0],
            'status': self.status,
            'action': self.action,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'platform': self.platform,
            'screen_resolution': self.screen_resolution,
            'language': self.language,
            'timezone': self.timezone,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.timestamp else None,
            'user_id': self.user_id
        }
    
    def __repr__(self):
        return f'<LoginActivity {self.email} - {self.status} at {self.timestamp}>'
