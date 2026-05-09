from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user
from flask import redirect, url_for, request
from models import User, SalesData, AdminLog, LoginActivity
from extensions import db

class SecureAdminIndexView(AdminIndexView):
    """Custom admin index view with authentication"""
    
    @expose('/')
    def index(self):
        if not current_user.is_authenticated or not current_user.is_admin:
            return redirect('/api/auth/login')
        
        # Get statistics
        total_users = User.query.count()
        total_sales = SalesData.query.count()
        total_revenue = db.session.query(db.func.sum(SalesData.revenue)).scalar() or 0
        total_profit = db.session.query(db.func.sum(SalesData.profit)).scalar() or 0
        total_logs = AdminLog.query.count()
        
        # Get recent data for tables
        users = User.query.order_by(User.id.desc()).limit(10).all()
        sales = SalesData.query.order_by(SalesData.id.desc()).limit(10).all()
        logs = AdminLog.query.order_by(AdminLog.timestamp.desc()).limit(10).all()
        
        return self.render('admin/custom_index.html',
                         total_users=total_users,
                         total_sales=total_sales,
                         total_revenue=total_revenue,
                         total_profit=total_profit,
                         total_logs=total_logs,
                         users=users,
                         sales=sales,
                         logs=logs)


class SecureModelView(ModelView):
    """Base model view with authentication"""
    
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect('/api/auth/login')


class UserAdminView(SecureModelView):
    """Admin view for User model"""
    
    column_list = ['id', 'name', 'email', 'is_admin', 'created_at', 'last_login']
    column_searchable_list = ['name', 'email']
    column_filters = ['is_admin', 'created_at']
    column_editable_list = ['name', 'is_admin']
    
    form_excluded_columns = ['password_hash', 'sales_data']
    
    column_formatters = {
        'created_at': lambda v, c, m, p: m.created_at.strftime('%Y-%m-%d %H:%M') if m.created_at else '',
        'last_login': lambda v, c, m, p: m.last_login.strftime('%Y-%m-%d %H:%M') if m.last_login else 'Never'
    }
    
    def on_model_change(self, form, model, is_created):
        """Log admin actions"""
        if is_created:
            log = AdminLog(
                admin_id=current_user.id,
                action='CREATE_USER',
                details=f'Created user: {model.email}',
                ip_address=request.remote_addr
            )
        else:
            log = AdminLog(
                admin_id=current_user.id,
                action='UPDATE_USER',
                details=f'Updated user: {model.email}',
                ip_address=request.remote_addr
            )
        db.session.add(log)
    
    def on_model_delete(self, model):
        """Log deletion"""
        log = AdminLog(
            admin_id=current_user.id,
            action='DELETE_USER',
            details=f'Deleted user: {model.email}',
            ip_address=request.remote_addr
        )
        db.session.add(log)


class SalesDataAdminView(SecureModelView):
    """Admin view for SalesData model"""
    
    column_list = ['id', 'user', 'date', 'product', 'category', 'region', 
                   'quantity', 'revenue', 'cost', 'profit']
    column_searchable_list = ['product', 'category', 'region']
    column_filters = ['date', 'category', 'region', 'user_id']
    column_editable_list = ['quantity', 'revenue', 'cost', 'profit']
    
    column_formatters = {
        'date': lambda v, c, m, p: m.date.strftime('%Y-%m-%d') if m.date else '',
        'revenue': lambda v, c, m, p: f'${m.revenue:,.2f}',
        'cost': lambda v, c, m, p: f'${m.cost:,.2f}',
        'profit': lambda v, c, m, p: f'${m.profit:,.2f}'
    }
    
    def on_model_change(self, form, model, is_created):
        """Calculate profit automatically"""
        model.profit = model.revenue - model.cost


class AdminLogView(SecureModelView):
    """Admin view for AdminLog model"""
    
    can_create = False
    can_edit = False
    can_delete = False
    
    column_list = ['id', 'admin', 'action', 'details', 'ip_address', 'timestamp']
    column_searchable_list = ['action', 'details']
    column_filters = ['action', 'timestamp']
    
    column_formatters = {
        'timestamp': lambda v, c, m, p: m.timestamp.strftime('%Y-%m-%d %H:%M:%S') if m.timestamp else '',
        'admin': lambda v, c, m, p: m.admin.email if m.admin else 'Unknown'
    }


class LoginActivityView(SecureModelView):
    """Admin view for LoginActivity model"""
    
    can_create = False
    can_edit = False
    can_delete = True
    
    column_list = ['id', 'email', 'username', 'status', 'action', 'ip_address', 'platform', 'timestamp']
    column_searchable_list = ['email', 'username', 'ip_address']
    column_filters = ['status', 'action', 'timestamp', 'email']
    column_default_sort = ('timestamp', True)
    
    column_formatters = {
        'timestamp': lambda v, c, m, p: m.timestamp.strftime('%Y-%m-%d %H:%M:%S') if m.timestamp else '',
        'status': lambda v, c, m, p: f'<span class="badge badge-{"success" if "SUCCESS" in m.status else "danger"}">{m.status}</span>'
    }
    
    column_labels = {
        'id': 'Log ID',
        'email': 'Email',
        'username': 'Username',
        'status': 'Status',
        'action': 'Action',
        'ip_address': 'IP Address',
        'platform': 'Platform',
        'timestamp': 'Timestamp'
    }


def setup_admin(app, db_instance):
    """Setup Flask-Admin with all views"""
    
    admin = Admin(
        app,
        name='Sparkle Sales Admin',
        index_view=SecureAdminIndexView()
    )
    
    # Add model views
    admin.add_view(UserAdminView(User, db_instance.session, name='Users', category='Management'))
    admin.add_view(SalesDataAdminView(SalesData, db_instance.session, name='Sales Data', category='Data'))
    admin.add_view(AdminLogView(AdminLog, db_instance.session, name='Admin Activity', category='System'))
    admin.add_view(LoginActivityView(LoginActivity, db_instance.session, name='Login Activity', category='System'))
    
    return admin
