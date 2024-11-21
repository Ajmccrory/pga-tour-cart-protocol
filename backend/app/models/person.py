from app import db

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, player, volunteer
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120), unique=True)
    active_cart = db.relationship('Cart', backref='assigned_to', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'phone': self.phone,
            'email': self.email,
            'active_cart': [cart.to_dict() for cart in self.active_cart]
        } 