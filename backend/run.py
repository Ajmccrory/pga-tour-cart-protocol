"""
Cart Management System - Application Entry Point
Author: AJ McCrory
Created: 2024
Description: Initializes and runs the Flask application server
             Creates database tables if they don't exist
"""

from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True) 