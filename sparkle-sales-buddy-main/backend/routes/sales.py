from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import SalesData
from extensions import db
from datetime import datetime
import csv
from io import StringIO
from data_preprocessor import DataPreprocessor

sales_bp = Blueprint('sales', __name__)

# Initialize preprocessor
data_preprocessor = DataPreprocessor()

@sales_bp.route('/', methods=['GET'])
@login_required
def get_sales_data():
    """Get all sales data for current user"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 100, type=int)
        category = request.args.get('category')
        region = request.args.get('region')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Build query
        query = SalesData.query.filter_by(user_id=current_user.id)
        
        # Apply filters
        if category:
            query = query.filter_by(category=category)
        if region:
            query = query.filter_by(region=region)
        if start_date:
            query = query.filter(SalesData.date >= datetime.fromisoformat(start_date).date())
        if end_date:
            query = query.filter(SalesData.date <= datetime.fromisoformat(end_date).date())
        
        # Pagination
        pagination = query.order_by(SalesData.date.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'sales_data': [item.to_dict() for item in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@sales_bp.route('/upload', methods=['POST'])
@login_required
def upload_sales_data():
    """Upload sales data from CSV or JSON with preprocessing"""
    try:
        if 'file' in request.files:
            # CSV file upload with preprocessing
            file = request.files['file']
            if not file.filename.endswith('.csv'):
                return jsonify({'error': 'Only CSV files are supported'}), 400
            
            # Read and preprocess CSV
            csv_content = file.stream.read().decode('UTF-8')
            
            try:
                cleaned_data, preprocess_log = data_preprocessor.process_csv(csv_content)
            except ValueError as e:
                return jsonify({
                    'error': str(e),
                    'help': 'Required columns: date, product, quantity, revenue. Optional: category, region, cost'
                }), 400
            
            # Create SalesData objects from cleaned data
            sales_items = []
            for row in cleaned_data:
                try:
                    sales_item = SalesData(
                        user_id=current_user.id,
                        date=datetime.strptime(row['date'], '%Y-%m-%d').date(),
                        product=row['product'],
                        category=row['category'],
                        region=row['region'],
                        quantity=row['quantity'],
                        revenue=row['revenue'],
                        cost=row['cost'],
                        profit=row['profit']
                    )
                    sales_items.append(sales_item)
                except Exception as e:
                    preprocess_log['warnings'].append(f"Failed to create record: {str(e)}")
                    continue
            
            if not sales_items:
                return jsonify({
                    'error': 'No valid data found after preprocessing',
                    'log': preprocess_log
                }), 400
            
            db.session.bulk_save_objects(sales_items)
            db.session.commit()
            
            return jsonify({
                'message': f'Successfully uploaded {len(sales_items)} records',
                'count': len(sales_items),
                'preprocessing': {
                    'total_rows': preprocess_log['total_rows'],
                    'valid_rows': preprocess_log['valid_rows'],
                    'null_removed': preprocess_log['null_removed'],
                    'outliers_removed': preprocess_log['outliers_removed'],
                    'warnings': preprocess_log['warnings'][:5]  # Limit warnings
                }
            }), 201
            
        elif request.is_json:
            # JSON data upload
            data = request.get_json()
            
            if not isinstance(data, list):
                data = [data]
            
            sales_items = []
            errors = []
            for idx, item in enumerate(data):
                try:
                    # Validate required fields
                    if not item.get('date'):
                        raise ValueError('Missing date')
                    if not item.get('product'):
                        raise ValueError('Missing product')
                    if item.get('quantity') is None or item.get('quantity') <= 0:
                        raise ValueError('Invalid quantity')
                    if item.get('revenue') is None or item.get('revenue') < 0:
                        raise ValueError('Invalid revenue')
                    
                    sales_item = SalesData(
                        user_id=current_user.id,
                        date=datetime.fromisoformat(item['date']).date(),
                        product=item['product'].strip(),
                        category=item.get('category', 'Other').strip() or 'Other',
                        region=item.get('region', 'Unknown').strip() or 'Unknown',
                        quantity=int(item['quantity']),
                        revenue=float(item['revenue']),
                        cost=float(item.get('cost', item['revenue'] * 0.6)),
                        profit=float(item.get('profit', item['revenue'] - item.get('cost', item['revenue'] * 0.6)))
                    )
                    sales_items.append(sales_item)
                except (KeyError, ValueError, TypeError) as e:
                    errors.append(f"Row {idx + 1}: {str(e)}")
                    continue
            
            if not sales_items:
                return jsonify({
                    'error': 'No valid data found',
                    'details': errors[:10]  # Limit error messages
                }), 400
            
            db.session.bulk_save_objects(sales_items)
            db.session.commit()
            
            response = {
                'message': f'Successfully uploaded {len(sales_items)} records',
                'count': len(sales_items)
            }
            if errors:
                response['warnings'] = errors[:5]
            
            return jsonify(response), 201
        
        else:
            return jsonify({'error': 'No file or data provided'}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@sales_bp.route('/<int:sales_id>', methods=['GET'])
@login_required
def get_sales_item(sales_id):
    """Get a specific sales item"""
    item = SalesData.query.filter_by(id=sales_id, user_id=current_user.id).first_or_404()
    return jsonify(item.to_dict()), 200


@sales_bp.route('/<int:sales_id>', methods=['PUT'])
@login_required
def update_sales_item(sales_id):
    """Update a sales item"""
    try:
        item = SalesData.query.filter_by(id=sales_id, user_id=current_user.id).first_or_404()
        data = request.get_json()
        
        # Update fields
        if 'date' in data:
            item.date = datetime.fromisoformat(data['date']).date()
        if 'product' in data:
            item.product = data['product']
        if 'category' in data:
            item.category = data['category']
        if 'region' in data:
            item.region = data['region']
        if 'quantity' in data:
            item.quantity = data['quantity']
        if 'revenue' in data:
            item.revenue = data['revenue']
        if 'cost' in data:
            item.cost = data['cost']
        if 'profit' in data:
            item.profit = data['profit']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Sales item updated successfully',
            'item': item.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@sales_bp.route('/<int:sales_id>', methods=['DELETE'])
@login_required
def delete_sales_item(sales_id):
    """Delete a sales item"""
    item = SalesData.query.filter_by(id=sales_id, user_id=current_user.id).first_or_404()
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Sales item deleted successfully'}), 200


@sales_bp.route('/clear', methods=['DELETE'])
@login_required
def clear_all_sales():
    """Clear all sales data for current user"""
    SalesData.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    
    return jsonify({'message': 'All sales data cleared'}), 200


@sales_bp.route('/categories', methods=['GET'])
@login_required
def get_categories():
    """Get unique categories"""
    categories = db.session.query(SalesData.category).filter_by(
        user_id=current_user.id
    ).distinct().all()
    
    return jsonify({
        'categories': [cat[0] for cat in categories]
    }), 200


@sales_bp.route('/regions', methods=['GET'])
@login_required
def get_regions():
    """Get unique regions"""
    regions = db.session.query(SalesData.region).filter_by(
        user_id=current_user.id
    ).distinct().all()
    
    return jsonify({
        'regions': [region[0] for region in regions]
    }), 200
