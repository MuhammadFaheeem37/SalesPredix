from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from models import SalesData, User
from extensions import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/admin-stats', methods=['GET'])
def get_admin_stats():
    """Get admin dashboard statistics (public endpoint for demo)"""
    try:
        total_users = User.query.count()
        total_sales = SalesData.query.count()
        total_revenue = db.session.query(func.sum(SalesData.revenue)).scalar() or 0
        total_profit = db.session.query(func.sum(SalesData.profit)).scalar() or 0
        
        return jsonify({
            'total_users': total_users,
            'total_sales': total_sales,
            'total_revenue': float(total_revenue),
            'total_profit': float(total_profit)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/kpis', methods=['GET'])
@login_required
def get_kpis():
    """Calculate and return KPIs"""
    try:
        # Get current month data
        now = datetime.utcnow()
        current_month_start = datetime(now.year, now.month, 1).date()
        
        # Last month
        if now.month == 1:
            last_month_start = datetime(now.year - 1, 12, 1).date()
            last_month_end = datetime(now.year, 1, 1).date()
        else:
            last_month_start = datetime(now.year, now.month - 1, 1).date()
            last_month_end = current_month_start
        
        # All time totals
        all_time = db.session.query(
            func.sum(SalesData.revenue).label('total_revenue'),
            func.sum(SalesData.profit).label('total_profit'),
            func.count(SalesData.id).label('total_orders')
        ).filter_by(user_id=current_user.id).first()
        
        # Current month
        current_month = db.session.query(
            func.sum(SalesData.revenue).label('revenue'),
            func.sum(SalesData.profit).label('profit'),
            func.count(SalesData.id).label('orders')
        ).filter(
            SalesData.user_id == current_user.id,
            SalesData.date >= current_month_start
        ).first()
        
        # Last month
        last_month = db.session.query(
            func.sum(SalesData.revenue).label('revenue'),
            func.sum(SalesData.profit).label('profit'),
            func.count(SalesData.id).label('orders')
        ).filter(
            SalesData.user_id == current_user.id,
            SalesData.date >= last_month_start,
            SalesData.date < last_month_end
        ).first()
        
        # Calculate growth percentages
        def calc_growth(current, previous):
            if not previous or previous == 0:
                return 100.0 if current and current > 0 else 0.0
            return ((current - previous) / previous) * 100
        
        total_revenue = float(all_time.total_revenue or 0)
        total_profit = float(all_time.total_profit or 0)
        total_orders = int(all_time.total_orders or 0)
        
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        current_revenue = float(current_month.revenue or 0)
        last_revenue = float(last_month.revenue or 0)
        
        current_profit = float(current_month.profit or 0)
        last_profit = float(last_month.profit or 0)
        
        current_orders = int(current_month.orders or 0)
        last_orders = int(last_month.orders or 0)
        
        current_aov = current_revenue / current_orders if current_orders > 0 else 0
        last_aov = last_revenue / last_orders if last_orders > 0 else 0
        
        return jsonify({
            'kpis': {
                'totalRevenue': total_revenue,
                'totalProfit': total_profit,
                'totalOrders': total_orders,
                'avgOrderValue': avg_order_value,
                'revenueGrowth': calc_growth(current_revenue, last_revenue),
                'profitGrowth': calc_growth(current_profit, last_profit),
                'ordersGrowth': calc_growth(current_orders, last_orders),
                'aovGrowth': calc_growth(current_aov, last_aov)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/monthly-trends', methods=['GET'])
@login_required
def get_monthly_trends():
    """Get monthly trends data"""
    try:
        trends = db.session.query(
            func.strftime('%Y-%m', SalesData.date).label('month'),
            func.sum(SalesData.revenue).label('revenue'),
            func.sum(SalesData.profit).label('profit'),
            func.count(SalesData.id).label('orders')
        ).filter_by(
            user_id=current_user.id
        ).group_by('month').order_by('month').all()
        
        return jsonify({
            'trends': [
                {
                    'name': datetime.strptime(t.month, '%Y-%m').strftime('%b %Y'),
                    'revenue': float(t.revenue),
                    'profit': float(t.profit),
                    'orders': t.orders
                }
                for t in trends
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/category-breakdown', methods=['GET'])
@login_required
def get_category_breakdown():
    """Get sales breakdown by category"""
    try:
        categories = db.session.query(
            SalesData.category,
            func.sum(SalesData.revenue).label('revenue')
        ).filter_by(
            user_id=current_user.id
        ).group_by(SalesData.category).all()
        
        total = sum(float(cat.revenue) for cat in categories)
        
        colors = {
            'Electronics': '#3b82f6',
            'Furniture': '#10b981',
            'Accessories': '#f59e0b',
            'Other': '#8b5cf6'
        }
        
        return jsonify({
            'breakdown': [
                {
                    'category': cat.category,
                    'revenue': float(cat.revenue),
                    'percentage': (float(cat.revenue) / total * 100) if total > 0 else 0,
                    'color': colors.get(cat.category, colors['Other'])
                }
                for cat in categories
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/top-products', methods=['GET'])
@login_required
def get_top_products():
    """Get top performing products"""
    try:
        limit = int(request.args.get('limit', 5))
        
        products = db.session.query(
            SalesData.product,
            func.sum(SalesData.revenue).label('revenue'),
            func.sum(SalesData.quantity).label('quantity')
        ).filter_by(
            user_id=current_user.id
        ).group_by(SalesData.product).order_by(
            func.sum(SalesData.revenue).desc()
        ).limit(limit).all()
        
        return jsonify({
            'products': [
                {
                    'name': p.product,
                    'revenue': float(p.revenue),
                    'quantity': int(p.quantity),
                    'growth': 10.5  # Placeholder - calculate based on historical data
                }
                for p in products
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/region-data', methods=['GET'])
@login_required
def get_region_data():
    """Get sales data by region"""
    try:
        regions = db.session.query(
            SalesData.region,
            func.sum(SalesData.revenue).label('revenue'),
            func.sum(SalesData.profit).label('profit'),
            func.count(SalesData.id).label('orders')
        ).filter_by(
            user_id=current_user.id
        ).group_by(SalesData.region).order_by(
            func.sum(SalesData.revenue).desc()
        ).all()
        
        return jsonify({
            'regions': [
                {
                    'region': r.region,
                    'revenue': float(r.revenue),
                    'profit': float(r.profit),
                    'orders': r.orders
                }
                for r in regions
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/dashboard', methods=['GET'])
@login_required
def get_dashboard_data():
    """Get all dashboard data in one request"""
    try:
        from flask import request as req
        
        # Get all analytics data
        kpis_response = get_kpis()
        trends_response = get_monthly_trends()
        category_response = get_category_breakdown()
        products_response = get_top_products()
        regions_response = get_region_data()
        
        return jsonify({
            'kpis': kpis_response[0].get_json()['kpis'],
            'monthlyTrends': trends_response[0].get_json()['trends'],
            'categoryBreakdown': category_response[0].get_json()['breakdown'],
            'topProducts': products_response[0].get_json()['products'],
            'regionData': regions_response[0].get_json()['regions']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
