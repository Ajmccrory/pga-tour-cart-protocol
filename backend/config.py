"""
Cart Management System - Configuration
Author: AJ McCrory
Created: 2024
Description: Configuration settings for the Flask application
             Loads environment variables and sets up database connection
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """
    Application configuration class
    
    Attributes:
        SQLALCHEMY_DATABASE_URI (str): Database connection string
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): SQLAlchemy event system flag
        SECRET_KEY (str): Application secret key for security
    """
    
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:Abcjk7869^$@localhost/cart_management'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-do-not-use-in-production'