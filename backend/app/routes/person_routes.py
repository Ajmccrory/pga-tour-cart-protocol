"""
Cart Management System - Person Routes
Author: AJ McCrory
Created: 2024
Description: API endpoints for person management
             Includes CRUD operations and error handling for person resources
"""

from flask import Blueprint, jsonify, request
from app.models.person import Person
from app import db
from app.utils.error_handlers import APIError

bp = Blueprint('persons', __name__)

@bp.route('/persons', methods=['GET'])
def get_persons():
    """
    Retrieve all persons
    
    Returns:
        JSON array of all person objects
    
    Raises:
        APIError: If database query fails
    """
    try:
        persons = Person.query.all()
        return jsonify([person.to_dict() for person in persons])
    except Exception as e:
        raise APIError('Failed to fetch persons', 500)

@bp.route('/persons', methods=['POST'])
def create_person():
    """
    Create a new person
    
    Returns:
        JSON object of created person
    
    Raises:
        APIError: If creation fails or validation error occurs
    """
    try:
        data = request.get_json()
        if not data:
            raise APIError('No data provided', 400)
            
        person = Person(
            name=data['name'],
            role=data['role'],
            phone=data.get('phone'),
            email=data.get('email')
        )
        db.session.add(person)
        db.session.commit()
        return jsonify(person.to_dict()), 201
    except KeyError as e:
        raise APIError(f'Missing required field: {str(e)}', 400)
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to create person: {str(e)}', 500)

@bp.route('/persons/<int:id>', methods=['PUT'])
def update_person(id):
    """
    Update an existing person
    
    Args:
        id: Person ID to update
    
    Returns:
        JSON object of updated person
    
    Raises:
        APIError: If update fails or person not found
    """
    try:
        person = Person.query.get_or_404(id)
        data = request.get_json()
        
        for field in ['name', 'role', 'phone', 'email']:
            if field in data:
                setattr(person, field, data[field])
        
        db.session.commit()
        return jsonify(person.to_dict())
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to update person: {str(e)}', 500)

@bp.route('/persons/<int:id>', methods=['DELETE'])
def delete_person(id):
    """
    Delete a person
    
    Args:
        id: Person ID to delete
    
    Returns:
        Empty response with 204 status
    
    Raises:
        APIError: If deletion fails or person not found
    """
    try:
        person = Person.query.get_or_404(id)
        db.session.delete(person)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        raise APIError(f'Failed to delete person: {str(e)}', 500) 