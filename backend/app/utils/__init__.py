"""
Cart Management System - Utilities Package
Author: AJ McCrory
Created: 2024
Description: Package initialization for utility functions and classes
             Includes error handling and other helper utilities
"""

from .error_handlers import APIError, register_error_handlers

__all__ = ['APIError', 'register_error_handlers'] 