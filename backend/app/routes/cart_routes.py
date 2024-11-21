from flask import Blueprint, jsonify, request
from app.models.cart import Cart
from app import db
from datetime import datetime

bp = Blueprint('carts', __name__)

@bp.route('/carts', methods=['GET'])
def get_carts():
    carts = Cart.query.all()
    return jsonify([cart.to_dict() for cart in carts])

@bp.route('/carts', methods=['POST'])
def create_cart():
    data = request.get_json()
    cart = Cart(
        cart_number=data['cart_number'],
        battery_level=data.get('battery_level', 100),
    )
    db.session.add(cart)
    db.session.commit()
    return jsonify(cart.to_dict()), 201

@bp.route('/carts/<int:id>', methods=['PUT'])
def update_cart(id):
    cart = Cart.query.get_or_404(id)
    data = request.get_json()
    
    if 'status' in data:
        cart.status = data['status']
        
        # If status changes to 'in-use', set checkout_time to now
        if data['status'] == 'in-use':
            cart.checkout_time = datetime.now()
        # If status changes to 'available', clear checkout_time
        elif data['status'] == 'available':
            cart.checkout_time = None
            cart.return_by_time = None
            cart.assigned_to_id = None
    
    db.session.commit()
    return jsonify(cart.to_dict())

@bp.route('/carts/<int:id>', methods=['DELETE'])
def delete_cart(id):
    cart = Cart.query.get_or_404(id)
    db.session.delete(cart)
    db.session.commit()
    return '', 204 