"""
Cart Management System - Database Initialization
Author: AJ McCrory
Created: 2024
Description: Script to initialize the database and create all tables
             Should be run once before starting the application
"""

from app import create_app, db
from app.models import Cart, Person

def init_database():
    """
    Initialize the database and create all tables
    
    Returns:
        None
    
    Raises:
        Exception: If database initialization fails
    """
    try:
        app = create_app()
        with app.app_context():
            db.create_all()
            print("Database tables created successfully!")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise

if __name__ == '__main__':
    init_database() 