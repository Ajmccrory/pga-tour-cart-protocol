"""
Cart Management System - Cart Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for cart management
"""

from flask import Blueprint, jsonify, request
from app.models.cart import Cart, cart_assignments
from app.models.person import Person
from app.models.cart_history import CartHistory
from app import db
from datetime import datetime, timedelta
from app.utils.error_handlers import APIError
import pytz
from flask_cors import cross_origin

bp = Blueprint('carts', __name__)

def get_eastern_time():
    """Get current time in Eastern timezone"""
    eastern = pytz.timezone('America/New_York')
    return datetime.now(eastern)

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
            checkout_time=Cart.parse_datetime(data.get('checkout_time')),
            return_by_time=Cart.parse_datetime(data.get('return_by_time'))
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
    """Update a cart"""
    try:
        cart = Cart.query.get_or_404(id)
        data = request.get_json()

        if 'status' in data:
            cart.status = data['status']
            
            if data['status'] == 'in-use':
                cart.set_checkout_time()
            elif data['status'] == 'available':
                cart.checkout_time = None
                cart.return_by_time = None

        if 'battery_level' in data:
            cart.battery_level = data['battery_level']

        if 'checkout_time' in data:
            checkout_time = Cart.parse_datetime(data['checkout_time'])
            if checkout_time:
                cart.set_checkout_time(checkout_time)

        db.session.commit()
        return jsonify(cart.to_dict())

    except APIError:
        db.session.rollback()
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

@bp.route('/carts/bulk', methods=['POST'])
def create_bulk_carts():
    """Create multiple carts at once"""
    try:
        data = request.get_json()
        if not data:
            raise APIError('No data provided', 400)

        required_fields = ['prefix', 'startNumber', 'count', 'status', 'battery_level']
        for field in required_fields:
            if field not in data:
                raise APIError(f'Missing required field: {field}', 400)

        if data['count'] < 1 or data['count'] > 50:
            raise APIError('Count must be between 1 and 50', 400)

        created_carts = []
        for i in range(data['count']):
            cart_number = f"{data['prefix']}-{str(data['startNumber'] + i).zfill(3)}"
            
            # Check if cart number already exists
            if Cart.query.filter_by(cart_number=cart_number).first():
                raise APIError(f'Cart number {cart_number} already exists', 400)
            
            cart = Cart(
                cart_number=cart_number,
                status=data['status'],
                battery_level=data['battery_level']
            )
            db.session.add(cart)
            created_carts.append(cart)

        db.session.commit()
        return jsonify([cart.to_dict() for cart in created_carts]), 201

    except APIError:
        db.session.rollback()
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to create carts: {str(e)}', 500)

@bp.route('/carts/bulk', methods=['DELETE'])
def delete_all_carts():
    """
    Delete all carts in the system
    Returns:
        Empty response with 204 status
    Raises:
        APIError: If deletion fails
    """
    try:
        # First, delete all cart assignments using raw SQL to avoid FK issues
        db.session.execute('DELETE FROM cart_assignments')
        
        # Then delete all carts
        Cart.query.delete()
        
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to delete carts: {str(e)}', 500)

@bp.route('/carts/<int:cart_id>/assign/<int:person_id>', methods=['POST', 'OPTIONS'])
@cross_origin()
def assign_person_to_cart(cart_id, person_id):
    """Assign a person to a cart"""
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        cart = Cart.query.get_or_404(cart_id)
        person = Person.query.get_or_404(person_id)

        if not cart.can_assign_person(person):
            raise APIError('Cart already has maximum number of assignments (2)', 400)

        if person in cart.assigned_to:
            raise APIError(f'{person.name} is already assigned to this cart', 400)

        cart.assigned_to.append(person)
        
        if cart.status != 'in-use':
            cart.status = 'in-use'
            cart.set_checkout_time()

        # Create history entry
        history_entry = CartHistory(
            cart_id=cart.id,
            person_id=person.id,
            checkout_time=cart.checkout_time,
            expected_return_time=cart.return_by_time,
            battery_level_start=cart.battery_level
        )
        db.session.add(history_entry)

        db.session.commit()
        return jsonify(cart.to_dict())

    except APIError:
        db.session.rollback()
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to assign person to cart: {str(e)}', 500)

@bp.route('/carts/<int:cart_id>/unassign/<int:person_id>', methods=['POST'])
def unassign_person_from_cart(cart_id, person_id):
    """Remove a person's assignment from a cart"""
    try:
        cart = Cart.query.get_or_404(cart_id)
        person = Person.query.get_or_404(person_id)

        if person not in cart.assigned_to:
            raise APIError(f'{person.name} is not assigned to this cart', 400)

        cart.assigned_to.remove(person)

        # If no one is assigned anymore, update cart status
        if not cart.assigned_to:
            cart.status = 'available'
            cart.checkout_time = None
            cart.return_by_time = None

        db.session.commit()
        return jsonify(cart.to_dict())

    except APIError:
        db.session.rollback()
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to unassign person from cart: {str(e)}', 500)

@bp.route('/carts/<int:cart_id>/return', methods=['POST'])
def return_cart(cart_id):
    """Process a cart return"""
    try:
        cart = Cart.query.get_or_404(cart_id)
        data = request.get_json()

        if not data:
            raise APIError('No data provided', 400)

        # Find the active history entry for this cart
        active_history = CartHistory.query.filter_by(
            cart_id=cart.id,
            return_time=None
        ).first()

        if not active_history:
            # Create a new history entry if none exists
            active_history = CartHistory(
                cart_id=cart.id,
                person_id=cart.assigned_to[0].id if cart.assigned_to else None,
                checkout_time=cart.checkout_time,
                expected_return_time=cart.return_by_time,
                battery_level_start=cart.battery_level
            )
            db.session.add(active_history)

        # Update the history entry with return information
        active_history.return_time = Cart.parse_datetime(data.get('return_time'))
        active_history.battery_level_end = data.get('battery_level')
        active_history.notes = data.get('notes')

        # Update cart status and battery level
        cart.status = 'available'
        cart.battery_level = data.get('battery_level', cart.battery_level)
        cart.checkout_time = None
        cart.return_by_time = None

        # Clear staff assignments
        cart.assigned_to = []

        db.session.commit()
        return jsonify(cart.to_dict())

    except APIError:
        db.session.rollback()
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to process cart return: {str(e)}', 500)

@bp.route('/carts/bulk-delete', methods=['POST', 'OPTIONS'])
@cross_origin()
def delete_selected_carts():
    """Delete multiple selected carts"""
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        if not data or 'cart_ids' not in data:
            raise APIError('No cart IDs provided', 400)
        
        cart_ids = data['cart_ids']
        if not isinstance(cart_ids, list):
            raise APIError('Cart IDs must be provided as a list', 400)
        
        # Delete history entries for selected carts
        CartHistory.query.filter(CartHistory.cart_id.in_(cart_ids)).delete(synchronize_session=False)
        
        # Delete assignments for selected carts
        db.session.execute(
            cart_assignments.delete().where(
                cart_assignments.c.cart_id.in_(cart_ids)
            )
        )
        
        # Delete the selected carts
        Cart.query.filter(Cart.id.in_(cart_ids)).delete(synchronize_session=False)
        
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to delete selected carts: {str(e)}', 500)
  