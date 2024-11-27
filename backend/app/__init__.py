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

# Initialize without arguments
db = SQLAlchemy()
pymysql.install_as_MySQLdb()

def create_app():
    """Creates and configures the Flask application"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions with app
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    from app.routes import cart_routes, person_routes
    app.register_blueprint(cart_routes.bp)
    app.register_blueprint(person_routes.bp)
    
    return app 