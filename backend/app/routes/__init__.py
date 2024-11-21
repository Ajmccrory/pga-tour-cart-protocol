"""
Cart Management System - Routes Package
Author: AJ McCrory
Created: 2024
Description: Package initialization for API routes
             Imports all route blueprints to make them available to the application
"""

from .cart_routes import bp as cart_bp
from .person_routes import bp as person_bp

__all__ = ['cart_bp', 'person_bp'] 