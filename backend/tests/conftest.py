"""
Cart Management System - Test Configuration
Author: AJ McCrory
Created: 2024
Description: Configuration and fixtures for pytest
             Sets up test database and application context
"""

import pytest
from app import create_app, db
from app.models import Cart, Person

@pytest.fixture
def app():
    """
    Create and configure a test Flask application
    
    Yields:
        Flask: Configured test application instance
    """
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """
    Create a test client
    
    Args:
        app: Flask application fixture
    
    Returns:
        FlaskClient: Test client for making requests
    """
    return app.test_client()

@pytest.fixture
def runner(app):
    """
    Create a test CLI runner
    
    Args:
        app: Flask application fixture
    
    Returns:
        FlaskCliRunner: Test runner for CLI commands
    """
    return app.test_cli_runner() 