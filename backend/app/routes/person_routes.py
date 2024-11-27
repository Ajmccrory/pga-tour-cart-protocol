"""
Cart Management System - Person Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for person management
"""

from flask import Blueprint, jsonify, request
from app.models.person import Person
from app import db
from app.utils.error_handlers import APIError

bp = Blueprint('persons', __name__)

@bp.route('/persons', methods=['GET'])
def get_persons():
    """Get all persons"""
    try:
        persons = Person.query.all()
        return jsonify([person.to_dict() for person in persons])
    except Exception as e:
        raise APIError('Failed to fetch persons', 500)

@bp.route('/persons/<int:id>', methods=['GET'])
def get_person(id):
    """Get a specific person"""
    try:
        person = Person.query.get_or_404(id)
        return jsonify(person.to_dict())
    except Exception as e:
        raise APIError(f'Failed to fetch person: {str(e)}', 500)

@bp.route('/persons', methods=['POST'])
def create_person():
    """Create a new person"""
    try:
        data = request.get_json()
        if not data:
            raise APIError('No data provided', 400)

        # Validate required fields
        if 'name' not in data:
            raise APIError('Name is required', 400)
        if 'role' not in data:
            raise APIError('Role is required', 400)

        # Validate data
        if not Person.validate_name(data['name']):
            raise APIError('Invalid name format. Use only letters, spaces, hyphens, and apostrophes', 400)
        if not Person.validate_role(data['role']):
            raise APIError('Invalid role. Must be either "admin" or "volunteer"', 400)
        if data.get('email') and not Person.validate_email(data['email']):
            raise APIError('Invalid email format', 400)
        if data.get('phone') and not Person.validate_phone(data['phone']):
            raise APIError('Invalid phone number format', 400)

        person = Person(
            name=data['name'],
            role=data['role'],
            phone=data.get('phone'),
            email=data.get('email')
        )
        db.session.add(person)
        db.session.commit()
        return jsonify(person.to_dict()), 201

    except APIError:
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to create person: {str(e)}', 500)

@bp.route('/persons/<int:id>', methods=['PUT'])
def update_person(id):
    """Update a person"""
    try:
        person = Person.query.get_or_404(id)
        data = request.get_json()

        if data.get('name'):
            if not Person.validate_name(data['name']):
                raise APIError('Invalid name format', 400)
            person.name = data['name']

        if data.get('role'):
            if not Person.validate_role(data['role']):
                raise APIError('Invalid role', 400)
            person.role = data['role']

        if 'email' in data:
            if data['email'] and not Person.validate_email(data['email']):
                raise APIError('Invalid email format', 400)
            person.email = data['email']

        if 'phone' in data:
            if data['phone'] and not Person.validate_phone(data['phone']):
                raise APIError('Invalid phone number format', 400)
            person.phone = data['phone']

        db.session.commit()
        return jsonify(person.to_dict())

    except APIError:
        raise
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to update person: {str(e)}', 500)

@bp.route('/persons/<int:id>', methods=['DELETE'])
def delete_person(id):
    """Delete a person"""
    try:
        person = Person.query.get_or_404(id)
        db.session.delete(person)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to delete person: {str(e)}', 500) 