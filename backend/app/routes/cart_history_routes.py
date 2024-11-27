"""
Cart Management System - Cart History Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for cart history management
"""

from flask import Blueprint, jsonify, request
from app.models.cart_history import CartHistory
from app import db
from app.utils.error_handlers import APIError
from flask_cors import cross_origin

bp = Blueprint('cart_history', __name__, url_prefix='/cart-history')

@bp.route('/<int:cart_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_cart_history(cart_id):
    """Get history entries for a specific cart"""
    try:
        history = CartHistory.query.filter_by(cart_id=cart_id).order_by(CartHistory.checkout_time.desc()).all()
        return jsonify([entry.to_dict() for entry in history])
    except Exception as e:
        raise APIError(f'Failed to fetch cart history: {str(e)}', 500)

@bp.route('/person/<int:person_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_person_history(person_id):
    """Get history entries for a specific person"""
    try:
        history = CartHistory.query.filter_by(person_id=person_id).order_by(CartHistory.checkout_time.desc()).all()
        return jsonify([entry.to_dict() for entry in history])
    except Exception as e:
        raise APIError(f'Failed to fetch person history: {str(e)}', 500) 