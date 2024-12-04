"""
Cart Management System - Cart History Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for cart history management
"""

from flask import Blueprint, jsonify, request
from app.models.cart_history import CartHistory
from app.models.cart import Cart
from app import db
from app.utils.error_handlers import APIError
from flask_cors import cross_origin

bp = Blueprint('cart_history', __name__, url_prefix='/cart-history')

@bp.route('', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def handle_cart_history():
    """Handle cart history operations"""
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        try:
            history = CartHistory.query.order_by(CartHistory.checkout_time.desc()).all()
            return jsonify([entry.to_dict() for entry in history])
        except Exception as e:
            raise APIError(f'Failed to fetch cart history: {str(e)}', 500)
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                raise APIError('No data provided', 400)

            history_entry = CartHistory(
                cart_id=data['cart_id'],
                person_id=data['person_id'],
                checkout_time=Cart.parse_datetime(data['checkout_time']),
                expected_return_time=Cart.parse_datetime(data['expected_return_time']),
                battery_level_start=data.get('battery_level_start'),
                notes=data.get('notes')
            )
            db.session.add(history_entry)
            db.session.commit()
            return jsonify(history_entry.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            raise APIError(f'Failed to create history entry: {str(e)}', 500)

@bp.route('/<int:cart_id>', methods=['GET', 'PUT', 'OPTIONS'])
@cross_origin()
def handle_cart_history_by_id(cart_id):
    """Handle operations for specific cart history"""
    if request.method == 'OPTIONS':
        return '', 204
        
    if request.method == 'GET':
        try:
            history = CartHistory.query.filter_by(cart_id=cart_id).order_by(CartHistory.checkout_time.desc()).all()
            return jsonify([entry.to_dict() for entry in history])
        except Exception as e:
            raise APIError(f'Failed to fetch cart history: {str(e)}', 500)
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            if not data:
                raise APIError('No data provided', 400)

            history_entry = CartHistory.query.filter_by(cart_id=cart_id, return_time=None).first()
            if not history_entry:
                raise APIError('No active history entry found for this cart', 404)

            if 'return_time' in data:
                history_entry.return_time = Cart.parse_datetime(data['return_time'])
            if 'battery_level_end' in data:
                history_entry.battery_level_end = data['battery_level_end']
            if 'notes' in data:
                history_entry.notes = data['notes']

            db.session.commit()
            return jsonify(history_entry.to_dict())
        except Exception as e:
            db.session.rollback()
            raise APIError(f'Failed to update history entry: {str(e)}', 500)

# Add error handler for this blueprint
@bp.errorhandler(APIError)
def handle_api_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response 