"""
Cart Management System - Cart Routes Tests
Author: AJ McCrory
Created: 2024
Description: Test suite for cart management API endpoints
             Includes tests for CRUD operations and error cases
"""

import pytest
from app.models import Cart
from flask import json

def test_get_carts(client):
    """
    Test getting all carts
    
    Args:
        client: Flask test client fixture
    """
    response = client.get('/carts')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_cart(client):
    """
    Test creating a new cart
    
    Args:
        client: Flask test client fixture
    """
    data = {
        'cart_number': 'TEST001',
        'battery_level': 100
    }
    response = client.post('/carts',
                          data=json.dumps(data),
                          content_type='application/json')
    assert response.status_code == 201
    assert response.json['cart_number'] == 'TEST001'

def test_update_cart(client):
    """
    Test updating an existing cart
    
    Args:
        client: Flask test client fixture
    """
    # First create a cart
    cart_data = {
        'cart_number': 'TEST002',
        'battery_level': 100
    }
    create_response = client.post('/carts',
                                data=json.dumps(cart_data),
                                content_type='application/json')
    cart_id = create_response.json['id']
    
    # Then update it
    update_data = {
        'status': 'in-use',
        'battery_level': 75
    }
    response = client.put(f'/carts/{cart_id}',
                         data=json.dumps(update_data),
                         content_type='application/json')
    assert response.status_code == 200
    assert response.json['status'] == 'in-use'
    assert response.json['battery_level'] == 75 