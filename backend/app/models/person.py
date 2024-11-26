from app import db
import re

class Person(db.Model):
    """
    Person database model representing staff members who can manage carts.
    
    Attributes:
        id (int): Primary key
        name (str): Full name of the person
        role (str): Role in the system (admin, volunteer)
        phone (str): Contact phone number
        email (str): Contact email address
        active_cart (relationship): Currently assigned cart(s)
    """
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    active_cart = db.relationship('Cart', backref='assigned_to', lazy=True)
    
    @staticmethod
    def validate_email(email):
        """Validates email format"""
        if not email:
            return True  # Email is optional
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_phone(phone):
        """Validates phone number format"""
        if not phone:
            return True  # Phone is optional
        pattern = r'^\+?1?\d{9,15}$'
        return bool(re.match(pattern, phone))
    
    @staticmethod
    def validate_name(name):
        """Validates that the full name is unique"""
        existing_person = Person.query.filter_by(name=name).first()
        return existing_person is None
    
    def to_dict(self):
        """
        Converts person object to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary representation of the person
        """
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'phone': self.phone,
            'email': self.email,
            'active_cart': [cart.to_dict() for cart in self.active_cart]
        } 