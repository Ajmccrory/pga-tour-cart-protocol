"""
Cart Management System - Application Factory
Author: AJ McCrory
Created: 2024
Description: Flask application factory that initializes the app with all necessary
             configurations, database connections, and blueprints.
"""

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
import pymysql
pymysql.install_as_MySQLdb()

db = SQLAlchemy()

def create_app():
    """Creates and configures the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS to allow requests from frontend
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    db.init_app(app)
    
    # Register blueprints
    from app.routes import cart_routes, person_routes
    app.register_blueprint(cart_routes.bp)
    app.register_blueprint(person_routes.bp)
    
    # Create all database tables
    with app.app_context():
        db.create_all()
    
    return app 