"""
Cart Management System - Cart Model
Author: AJ McCrory
Created: 2024
Description: Database model for cart entities, including relationships and data serialization
"""

from app import db
from datetime import datetime
import pytz

class Cart(db.Model):
    """
    Cart database model representing golf carts in the system.
    
    Attributes:
        id (int): Primary key
        cart_number (str): Unique identifier for the cart
        status (str): Current status of the cart (available, in-use, maintenance)
        battery_level (int): Current battery percentage
        checkout_time (datetime): When the cart was checked out (in Eastern Time)
        return_by_time (datetime): When the cart should be returned (in Eastern Time)
        assigned_to_id (int): Foreign key to person currently using the cart
    """
    
    id = db.Column(db.Integer, primary_key=True)
    cart_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default='available')
    battery_level = db.Column(db.Integer)
    checkout_time = db.Column(db.DateTime(timezone=True))
    return_by_time = db.Column(db.DateTime(timezone=True))
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    
    @staticmethod
    def parse_datetime(datetime_str):
        """Convert ISO format datetime string to Python datetime object in Eastern Time"""
        if not datetime_str:
            return None
        try:
            dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
            eastern = pytz.timezone('America/New_York')
            return dt.astimezone(eastern)
        except (ValueError, AttributeError):
            return None
    
    def to_dict(self):
        """
        Converts cart object to dictionary for JSON serialization.
        Times are converted to Eastern Time.
        
        Returns:
            dict: Dictionary representation of the cart
        """
        eastern = pytz.timezone('America/New_York')
        
        checkout_time = self.checkout_time.astimezone(eastern) if self.checkout_time else None
        return_time = self.return_by_time.astimezone(eastern) if self.return_by_time else None
        
        return {
            'id': self.id,
            'cart_number': self.cart_number,
            'status': self.status,
            'battery_level': self.battery_level,
            'checkout_time': checkout_time.isoformat() if checkout_time else None,
            'return_by_time': return_time.isoformat() if return_time else None,
            'assigned_to_id': self.assigned_to_id
        } 