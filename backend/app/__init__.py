"""
Cart Management System - Application Factory
Author: AJ McCrory
Created: 2024
Description: Flask application factory and configuration
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={
        r"/*": {
            "origins": "http://localhost:3000",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True,
            "send_wildcard": False
        }
    })
    
    db.init_app(app)
    
    from app.routes import cart_routes, person_routes, cart_history_routes
    app.register_blueprint(cart_routes.bp)
    app.register_blueprint(person_routes.bp)
    app.register_blueprint(cart_history_routes.bp)
    
    return app 