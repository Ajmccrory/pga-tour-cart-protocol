"""
Cart Management System - Cart Model
Author: AJ McCrory
Created: 2024
Description: Database model for cart entities, including relationships and data serialization
"""

from app import db
from datetime import datetime

class Cart(db.Model):
    """
    Cart database model representing golf carts in the system.
    
    Attributes:
        id (int): Primary key
        cart_number (str): Unique identifier for the cart
        status (str): Current status of the cart (available, in-use, maintenance)
        battery_level (int): Current battery percentage
        checkout_time (datetime): When the cart was checked out
        return_by_time (datetime): When the cart should be returned
        assigned_to_id (int): Foreign key to person currently using the cart
    """
    
    id = db.Column(db.Integer, primary_key=True)
    cart_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default='available')
    battery_level = db.Column(db.Integer)
    checkout_time = db.Column(db.DateTime)
    return_by_time = db.Column(db.DateTime)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    
    def to_dict(self):
        """
        Converts cart object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary representation of the cart
        """
        return {
            'id': self.id,
            'cart_number': self.cart_number,
            'status': self.status,
            'battery_level': self.battery_level,
            'checkout_time': self.checkout_time.isoformat() if self.checkout_time else None,
            'return_by_time': self.return_by_time.isoformat() if self.return_by_time else None,
            'assigned_to_id': self.assigned_to_id
        } 