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
    """
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))

    @staticmethod
    def validate_name(name: str) -> bool:
        """Validate person name"""
        if not name or len(name.strip()) < 2:
            return False
        return bool(re.match(r'^[A-Za-z\s\'-]+$', name))

    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email:
            return True  # Email is optional
        return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        if not phone:
            return True  # Phone is optional
        return bool(re.match(r'^\+?1?\d{10,15}$', phone))

    @staticmethod
    def validate_role(role: str) -> bool:
        """Validate role"""
        return role in ['admin', 'volunteer']

    def to_dict(self, include_relationships=True):
        """
        Converts person object to dictionary for JSON serialization.
        Args:
            include_relationships: Whether to include nested relationships
        """
        result = {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'phone': self.phone,
            'email': self.email,
        }
        
        if include_relationships:
            result['assigned_carts'] = [cart.to_dict(include_relationships=False) for cart in self.assigned_carts]
            
        return result

    def __repr__(self):
        return f'<Person {self.name}>'