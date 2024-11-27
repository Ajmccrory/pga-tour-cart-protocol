"""
Cart Management System - Cart History Model
Author: AJ McCrory
Created: 2024
Description: Database model for tracking cart usage history
"""

from app import db
from datetime import datetime
import pytz

class CartHistory(db.Model):
    """
    Cart History database model for tracking cart usage.
    
    Attributes:
        id (int): Primary key
        cart_id (int): Foreign key to cart
        person_id (int): Foreign key to person who used the cart
        checkout_time (datetime): When the cart was checked out
        return_time (datetime): When the cart was actually returned
        expected_return_time (datetime): When the cart was supposed to be returned
        battery_level_start (int): Battery level at checkout
        battery_level_end (int): Battery level at return
        notes (str): Any additional notes about the usage
    """
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    checkout_time = db.Column(db.DateTime, nullable=False)
    return_time = db.Column(db.DateTime)
    expected_return_time = db.Column(db.DateTime, nullable=False)
    battery_level_start = db.Column(db.Integer)
    battery_level_end = db.Column(db.Integer)
    notes = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    cart = db.relationship('Cart', backref=db.backref('history', lazy=True))
    person = db.relationship('Person', backref=db.backref('cart_history', lazy=True))
    
    def to_dict(self):
        """Convert history entry to dictionary for JSON serialization"""
        eastern = pytz.timezone('America/New_York')
        
        def format_datetime(dt):
            if not dt:
                return None
            if not dt.tzinfo:
                dt = eastern.localize(dt)
            return dt.isoformat()
        
        return {
            'id': self.id,
            'cart_id': self.cart_id,
            'cart_number': self.cart.cart_number,
            'person_id': self.person_id,
            'person_name': self.person.name,
            'checkout_time': format_datetime(self.checkout_time),
            'return_time': format_datetime(self.return_time),
            'expected_return_time': format_datetime(self.expected_return_time),
            'battery_level_start': self.battery_level_start,
            'battery_level_end': self.battery_level_end,
            'notes': self.notes,
            'created_at': format_datetime(self.created_at)
        } 