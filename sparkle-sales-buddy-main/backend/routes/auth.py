from flask import Blueprint, request, jsonify, session, render_template_string, redirect, url_for
from flask_login import login_user, logout_user, current_user, login_required
from models import User, AdminLog, LoginActivity
from extensions import db
from datetime import datetime
from functools import wraps
import time

auth_bp = Blueprint('auth', __name__)

# Simple login page template
LOGIN_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - Sparkle Sales</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .login-card { max-width: 400px; margin: 100px auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card login-card shadow">
            <div class="card-body p-5">
                <h2 class="text-center mb-4">🔐 Admin Login</h2>
                {% if error %}
                <div class="alert alert-danger">{{ error }}</div>
                {% endif %}
                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
                <p class="text-muted mt-3 text-center small">Default: admin@sparklesales.com / admin123</p>
            </div>
        </div>
    </div>
</body>
</html>
'''

def admin_required(f):
    @wraps(f)
    @login_required
    def decorated_function(*args, **kwargs):
        if not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Auto login after registration
        login_user(user)
        
        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Login user - supports both form and API"""
    # Handle GET request - show login form
    if request.method == 'GET':
        if current_user.is_authenticated:
            return redirect('/admin/')
        return render_template_string(LOGIN_TEMPLATE, error=None)
    
    # Handle POST request
    try:
        # Check if it's a form submission or API call
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
        else:
            data = {
                'email': request.form.get('email'),
                'password': request.form.get('password')
            }
        
        if not all(k in data and data[k] for k in ('email', 'password')):
            if request.content_type and 'application/json' in request.content_type:
                return jsonify({'error': 'Email and password required'}), 400
            return render_template_string(LOGIN_TEMPLATE, error='Email and password required')
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            if request.content_type and 'application/json' in request.content_type:
                return jsonify({'error': 'Invalid email or password'}), 401
            return render_template_string(LOGIN_TEMPLATE, error='Invalid email or password')
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Login user
        login_user(user, remember=True)
        
        # Redirect to admin if form submission, otherwise return JSON
        if request.content_type and 'application/json' in request.content_type:
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict()
            }), 200
        
        return redirect('/admin/')
        
    except Exception as e:
        if request.content_type and 'application/json' in request.content_type:
            return jsonify({'error': str(e)}), 500
        return render_template_string(LOGIN_TEMPLATE, error=str(e))


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    """Logout current user"""
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged in user"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200


@auth_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users (Admin only)"""
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200


@auth_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    """Create a new user (Admin only)"""
    try:
        data = request.get_json() or {}

        if not all(k in data and data[k] for k in ('name', 'email', 'password')):
            return jsonify({'error': 'Name, email, and password are required'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        user = User(
            name=data['name'],
            email=data['email'],
            is_admin=bool(data.get('is_admin'))
        )
        user.set_password(data['password'])

        db.session.add(user)

        log = AdminLog(
            admin_id=current_user.id,
            action='CREATE_USER',
            details=f'Created user: {user.email}',
            ip_address=request.remote_addr
        )
        db.session.add(log)

        db.session.commit()

        return jsonify({'message': 'User created successfully', 'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update a user (Admin only)"""
    try:
        data = request.get_json() or {}
        user = User.query.get_or_404(user_id)

        if 'email' in data and data['email']:
            existing = User.query.filter_by(email=data['email']).first()
            if existing and existing.id != user.id:
                return jsonify({'error': 'Email already registered'}), 400
            user.email = data['email']

        if 'name' in data and data['name']:
            user.name = data['name']

        if 'is_admin' in data:
            if user.id == current_user.id and not bool(data['is_admin']):
                return jsonify({'error': 'Cannot remove admin rights from your own account'}), 400
            user.is_admin = bool(data['is_admin'])

        if 'password' in data and data['password']:
            if len(data['password']) < 6:
                return jsonify({'error': 'Password must be at least 6 characters'}), 400
            user.set_password(data['password'])

        log = AdminLog(
            admin_id=current_user.id,
            action='UPDATE_USER',
            details=f'Updated user: {user.email}',
            ip_address=request.remote_addr
        )
        db.session.add(log)

        db.session.commit()

        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Delete a user (Admin only)"""
    user = User.query.get_or_404(user_id)
    
    if user.id == current_user.id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    # Log admin action
    log = AdminLog(
        admin_id=current_user.id,
        action='DELETE_USER',
        details=f'Deleted user: {user.email}',
        ip_address=request.remote_addr
    )
    db.session.add(log)
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User deleted successfully'}), 200


@auth_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """Change user password"""
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('current_password', 'new_password')):
            return jsonify({'error': 'Current and new password required'}), 400
        
        if not current_user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        if len(data['new_password']) < 6:
            return jsonify({'error': 'New password must be at least 6 characters'}), 400
        
        current_user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/log-login', methods=['POST'])
def log_login_attempt():
    """API endpoint to log login attempts from frontend"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email'):
            return jsonify({"success": False, "error": "Email required"}), 400
        
        email = data.get('email')
        password = data.get('password', '')
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        # Create login activity record
        login_activity = LoginActivity(
            email=email,
            username=email.split('@')[0],
            ip_address=request.remote_addr,
            user_agent=data.get('userAgent', request.user_agent.string),
            platform=data.get('platform', ''),
            screen_resolution=data.get('screenResolution', ''),
            language=data.get('language', ''),
            timezone=data.get('timezone', '')
        )
        
        # Check credentials
        if user and user.check_password(password):
            login_activity.status = 'SUCCESS'
            login_activity.action = 'LOGIN_SUCCESS'
            login_activity.user_id = user.id
            
            # Update user's last login
            user.last_login = datetime.utcnow()
            
            success = True
            message = "Login successful"
        else:
            login_activity.status = 'FAILED'
            login_activity.action = 'LOGIN_FAILED'
            success = False
            message = "Invalid credentials"
        
        # Save to database
        db.session.add(login_activity)
        db.session.commit()
        
        return jsonify({
            "success": success,
            "message": message,
            "log_id": f"#LOG{login_activity.id}",
            "user": login_activity.username,
            "status": login_activity.status,
            "timestamp": login_activity.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "server_time": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@auth_bp.route('/get-all-login-logs', methods=['GET'])
@admin_required
def get_all_login_logs():
    """Retrieve all login activity logs (Admin only)"""
    logs = LoginActivity.query.order_by(LoginActivity.timestamp.desc()).all()
    return jsonify({
        "logs": [log.to_dict() for log in logs],
        "total": len(logs),
        "server": "Sparkle Sales Buddy v1.0.0",
        "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    })


@auth_bp.route('/get-recent-login-logs', methods=['GET'])
def get_recent_login_logs():
    """Get recent 20 login logs"""
    logs = LoginActivity.query.order_by(LoginActivity.timestamp.desc()).limit(20).all()
    return jsonify({
        "recent_logs": [log.to_dict() for log in logs],
        "count": len(logs)
    })


@auth_bp.route('/clear-login-logs', methods=['DELETE'])
@admin_required
def clear_login_logs():
    """Clear all login logs (for testing) - Admin only"""
    count = LoginActivity.query.count()
    LoginActivity.query.delete()
    db.session.commit()
    return jsonify({
        "success": True,
        "message": f"Cleared {count} login logs",
        "remaining": 0
    })
