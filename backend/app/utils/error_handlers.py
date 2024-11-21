"""
Cart Management System - Error Handlers
Author: AJ McCrory
Created: 2024
Description: Custom error handling utilities for standardized API error responses
"""

from flask import jsonify
from werkzeug.exceptions import HTTPException

class APIError(Exception):
    """
    Custom API Exception for standardized error handling
    
    Attributes:
        message (str): Human readable error message
        status_code (int): HTTP status code
        payload (dict): Additional error details
    """
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """
        Convert error to dictionary format
        
        Returns:
            dict: Error details including message and status code
        """
        rv = dict(self.payload or ())
        rv['message'] = self.message
        rv['status_code'] = self.status_code
        return rv

def register_error_handlers(app):
    """
    Register error handlers with Flask application
    
    Args:
        app: Flask application instance
    """
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        response = jsonify({
            'message': error.description,
            'status_code': error.code
        })
        response.status_code = error.code
        return response

    @app.errorhandler(Exception)
    def handle_generic_error(error):
        response = jsonify({
            'message': 'An unexpected error occurred',
            'status_code': 500
        })
        response.status_code = 500
        return response 