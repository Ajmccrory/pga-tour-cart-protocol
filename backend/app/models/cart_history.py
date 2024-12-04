"""
Cart Management System - Cart History Model
Author: AJ McCrory
Created: 2024
Description: Database model for tracking cart usage history
"""

from app import db
from datetime import datetime, timedelta
import pytz

class CartHistory(db.Model):
    """
    Cart History database model for tracking cart usage.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    checkout_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    return_time = db.Column(db.DateTime, nullable=True)
    expected_return_time = db.Column(db.DateTime, nullable=False, default=lambda: datetime.utcnow() + timedelta(hours=6))
    battery_level_start = db.Column(db.Integer, nullable=False, default=100)
    battery_level_end = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    cart = db.relationship('Cart', backref=db.backref('history', lazy=True))
    person = db.relationship('Person', backref=db.backref('cart_history', lazy=True))
    
    def __init__(self, **kwargs):
        """Initialize with current time if checkout_time not provided"""
        if 'checkout_time' not in kwargs:
            eastern = pytz.timezone('America/New_York')
            current_time = datetime.now(eastern)
            kwargs['checkout_time'] = current_time
            kwargs['expected_return_time'] = current_time + timedelta(hours=6)
        
        super(CartHistory, self).__init__(**kwargs)
    
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