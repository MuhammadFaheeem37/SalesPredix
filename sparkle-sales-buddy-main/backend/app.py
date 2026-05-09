from flask import Flask, redirect
from flask_cors import CORS
from flask_admin import Admin
from dotenv import load_dotenv
import os

# Import extensions from shared module
from extensions import db, bcrypt, login_manager

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///sparkle_sales.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    
    # Import models
    from models import User, SalesData, LoginActivity
    
    # Create tables
    with app.app_context():
        db.create_all()
        # Create default admin user if not exists
        admin_user = User.query.filter_by(email='admin@sparklesales.com').first()
        if not admin_user:
            admin_user = User(
                name='Admin',
                email='admin@sparklesales.com',
                is_admin=True
            )
            admin_user.set_password('admin123')
            db.session.add(admin_user)
            db.session.commit()
            print("✅ Default admin user created: admin@sparklesales.com / admin123")
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.sales import sales_bp
    from routes.analytics import analytics_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(sales_bp, url_prefix='/api/sales')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    # Setup Admin Panel
    from admin_panel import setup_admin
    setup_admin(app, db)
    
    # User loader for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Home route - redirect to admin
    @app.route('/')
    def home():
        return redirect('/admin/')
    
    return app

if __name__ == '__main__':
    app = create_app()
<<<<<<< HEAD
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    print("🚀 Sparkle Sales Backend Server Starting...")
    print(f"📊 Admin Panel: http://{host}:{port}/admin")
    print("🔐 Default Admin: admin@sparklesales.com / admin123")
    app.run(debug=True, port=port, host=host)
=======
    port = int(os.environ.get('PORT', 5000))
    print("🚀 Sparkle Sales Backend Server Starting...")
    print(f"📊 Admin Panel: http://localhost:{port}/admin")
    print("🔐 Default Admin: admin@sparklesales.com / admin123")
    app.run(host='0.0.0.0', port=port, debug=False)
>>>>>>> 270b6177ffa77471912de3df55c53478041db630
