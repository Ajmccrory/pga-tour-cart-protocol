"""
Cart Management System - Cart Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for cart management
             Includes CRUD operations and error handling for cart resources
"""

from flask import Blueprint, jsonify, request
from app.models.cart import Cart
from app import db
from datetime import datetime
from app.utils.error_handlers import APIError

bp = Blueprint('carts', __name__)

@bp.route('/carts', methods=['GET'])
def get_carts():
    """
    Retrieve all carts
    Returns:
        JSON array of all cart objects
    Raises:
        APIError: If database query fails
    """
    try:
        carts = Cart.query.all()
        return jsonify([cart.to_dict() for cart in carts])
    except Exception as e:
        raise APIError('Failed to fetch carts', 500)

@bp.route('/carts', methods=['POST'])
def create_cart():
    try:
        data = request.get_json()
        if not data:
            raise APIError('No data provided', 400)
        
        if 'cart_number' not in data:
            raise APIError('Cart number is required', 400)

        # Check if cart number already exists
        existing_cart = Cart.query.filter_by(cart_number=data['cart_number']).first()
        if existing_cart:
            raise APIError(f"Cart number '{data['cart_number']}' already exists", 409)

        cart = Cart(
            cart_number=data['cart_number'],
            battery_level=data.get('battery_level', 100),
            status=data.get('status', 'available'),
            checkout_time=data.get('checkout_time'),
            return_by_time=data.get('return_by_time')
        )
        db.session.add(cart)
        db.session.commit()
        return jsonify(cart.to_dict()), 201
    except APIError:
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to create cart: {str(e)}', 500)

@bp.route('/carts/<int:id>', methods=['PUT'])
def update_cart(id):
    try:
        cart = Cart.query.get_or_404(id)
        data = request.get_json()
        if not data:
            raise APIError('No data provided', 400)
        
        if 'status' in data:
            if data['status'] not in ['available', 'in-use', 'maintenance']:
                raise APIError('Invalid status value', 400)
            
            cart.status = data['status']
            
            if data['status'] == 'in-use':
                cart.checkout_time = datetime.now()
            elif data['status'] == 'available':
                cart.checkout_time = None
                cart.return_by_time = None
                cart.assigned_to_id = None

        if 'battery_level' in data:
            if not isinstance(data['battery_level'], (int, float)) or \
               not 0 <= data['battery_level'] <= 100:
                raise APIError('Battery level must be between 0 and 100', 400)
            cart.battery_level = data['battery_level']
        
        db.session.commit()
        return jsonify(cart.to_dict())
    except APIError:
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to update cart: {str(e)}', 500)

@bp.route('/carts/<int:id>', methods=['DELETE'])
def delete_cart(id):
    try:
        cart = Cart.query.get_or_404(id)
        db.session.delete(cart)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to delete cart: {str(e)}', 500) 