from app import db
from datetime import datetime

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_number = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    battery_level = db.Column(db.Integer)
    checkout_time = db.Column(db.DateTime)
    return_by_time = db.Column(db.DateTime)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'cart_number': self.cart_number,
            'status': self.status,
            'battery_level': self.battery_level,
            'checkout_time': self.checkout_time.isoformat() if self.checkout_time else None,
            'return_by_time': self.return_by_time.isoformat() if self.return_by_time else None,
            'assigned_to_id': self.assigned_to_id
        } 