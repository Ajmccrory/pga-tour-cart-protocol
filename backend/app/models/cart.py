"""
Cart Management System - Cart Model
Author: AJ McCrory
Created: 2024
Description: Database model for cart entities, including relationships and data serialization
"""

from app import db
from datetime import datetime, timedelta
import pytz

# Association table for cart assignments
cart_assignments = db.Table('cart_assignments',
    db.Column('cart_id', db.Integer, db.ForeignKey('cart.id'), primary_key=True),
    db.Column('person_id', db.Integer, db.ForeignKey('person.id'), primary_key=True)
)

class Cart(db.Model):
    """
    Cart database model representing golf carts in the system.
    """
    
    id = db.Column(db.Integer, primary_key=True)
    cart_number = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.String(20), default='available')
    battery_level = db.Column(db.Integer)
    checkout_time = db.Column(db.DateTime)
    return_by_time = db.Column(db.DateTime)
    
    # Many-to-many relationship with Person
    assigned_to = db.relationship('Person', 
                                secondary=cart_assignments,
                                lazy='joined',
                                backref=db.backref('assigned_carts', lazy=True))
    
    def can_assign_person(self, person):
        """Check if another person can be assigned to this cart"""
        return len(self.assigned_to) < 2
    
    @staticmethod
    def get_eastern_time():
        """Get current time in Eastern timezone"""
        eastern = pytz.timezone('America/New_York')
        now = datetime.now()
        return eastern.localize(now)
    
    @staticmethod
    def parse_datetime(datetime_str):
        """Convert ISO format datetime string to Python datetime object"""
        if not datetime_str:
            return None
        try:
            # Handle ISO format with timezone
            if 'Z' in datetime_str:
                datetime_str = datetime_str.replace('Z', '+00:00')
            
            # Parse the datetime string
            dt = datetime.fromisoformat(datetime_str)
            
            # Convert to Eastern Time
            eastern = pytz.timezone('America/New_York')
            if dt.tzinfo:
                dt = dt.astimezone(eastern)
            else:
                dt = eastern.localize(dt)
            
            # Return naive datetime for MySQL
            return dt.replace(tzinfo=None)
            
        except (ValueError, AttributeError) as e:
            print(f"Error parsing datetime: {e}")
            return None

    @staticmethod
    def calculate_return_time(checkout_time):
        """Calculate return time based on checkout time (same day, 6 hours later)"""
        if not checkout_time:
            return None

        eastern = pytz.timezone('America/New_York')
        
        # Make sure checkout_time is naive
        if checkout_time.tzinfo:
            checkout_time = checkout_time.replace(tzinfo=None)
        
        # Add timezone info
        checkout_time = eastern.localize(checkout_time)
        
        # Add 6 hours
        return_time = checkout_time + timedelta(hours=6)
        
        # Keep return time on the same day
        if return_time.date() > checkout_time.date():
            # Set to 11:59 PM of the checkout day
            return_time = datetime.combine(
                checkout_time.date(),
                datetime.strptime('23:59:59', '%H:%M:%S').time()
            )
            return_time = eastern.localize(return_time)
        
        # Return naive datetime for database storage
        return return_time.replace(tzinfo=None)
    
    def set_checkout_time(self, time=None):
        """Set checkout time and automatically calculate return time"""
        if time is None:
            # Use current Eastern Time
            time = self.get_eastern_time()
        
        # Make sure time is naive for database storage
        if time.tzinfo:
            time = time.replace(tzinfo=None)
            
        self.checkout_time = time
        self.return_by_time = self.calculate_return_time(time)
    
    def to_dict(self, include_relationships=True):
        """
        Converts cart object to dictionary for JSON serialization.
        Args:
            include_relationships: Whether to include nested relationships
        """
        eastern = pytz.timezone('America/New_York')
        
        def format_datetime(dt):
            """Format datetime with timezone for JSON"""
            if not dt:
                return None
            # Convert naive datetime to Eastern Time
            if not dt.tzinfo:
                dt = eastern.localize(dt)
            return dt.isoformat()
        
        result = {
            'id': self.id,
            'cart_number': self.cart_number,
            'status': self.status,
            'battery_level': self.battery_level,
            'checkout_time': format_datetime(self.checkout_time),
            'return_by_time': format_datetime(self.return_by_time),
        }
        
        if include_relationships:
            result['assigned_to'] = [person.to_dict(include_relationships=False) for person in self.assigned_to]
            
        return result 