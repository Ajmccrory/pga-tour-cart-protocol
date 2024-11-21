from flask import Blueprint, jsonify, request
from app.models.person import Person
from app import db

bp = Blueprint('persons', __name__)

@bp.route('/persons', methods=['GET'])
def get_persons():
    persons = Person.query.all()
    return jsonify([person.to_dict() for person in persons])

@bp.route('/persons', methods=['POST'])
def create_person():
    data = request.get_json()
    person = Person(
        name=data['name'],
        role=data['role'],
        phone=data.get('phone'),
        email=data.get('email')
    )
    db.session.add(person)
    db.session.commit()
    return jsonify(person.to_dict()), 201

@bp.route('/persons/<int:id>', methods=['PUT'])
def update_person(id):
    person = Person.query.get_or_404(id)
    data = request.get_json()
    
    for field in ['name', 'role', 'phone', 'email']:
        if field in data:
            setattr(person, field, data[field])
    
    db.session.commit()
    return jsonify(person.to_dict())

@bp.route('/persons/<int:id>', methods=['DELETE'])
def delete_person(id):
    person = Person.query.get_or_404(id)
    db.session.delete(person)
    db.session.commit()
    return '', 204 