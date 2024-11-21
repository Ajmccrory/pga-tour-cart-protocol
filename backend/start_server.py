import subprocess
import getpass
import time
import os
import pymysql
import json
from app import create_app

CREDENTIALS_FILE = '.db_credentials.json'

def load_credentials():
    """Load credentials from file if they exist"""
    try:
        if os.path.exists(CREDENTIALS_FILE):
            with open(CREDENTIALS_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading credentials: {e}")
    return None

def save_credentials(username, password):
    """Save credentials to file"""
    try:
        with open(CREDENTIALS_FILE, 'w') as f:
            json.dump({
                'username': username,
                'password': password
            }, f)
    except Exception as e:
        print(f"Error saving credentials: {e}")

def get_credentials():
    """Get credentials from file or user input"""
    creds = load_credentials()
    if creds:
        print("Using saved credentials")
        return creds['username'], creds['password']
    
    # If no saved credentials, ask user
    username = input("Enter MySQL username: ")
    password = getpass.getpass("Enter MySQL password: ")
    
    # Save the new credentials
    save_credentials(username, password)
    return username, password

def start_mysql():
    try:
        print("Starting MySQL service...")
        subprocess.run(['mysql.server', 'start'], check=True)
        print("MySQL service started successfully")
        return True
    except subprocess.CalledProcessError:
        print("Error starting MySQL service")
        return False

def initialize_database(username, password):
    try:
        connection = pymysql.connect(
            host='localhost',
            user=username,
            password=password
        )
        
        with connection.cursor() as cursor:
            cursor.execute('CREATE DATABASE IF NOT EXISTS cart_management')
            cursor.execute('USE cart_management')
            
            # Add the missing column if it doesn't exist
            try:
                cursor.execute("ALTER TABLE cart ADD COLUMN return_by_time DATETIME NULL")
                connection.commit()
                print("Added return_by_time column")
            except pymysql.err.OperationalError as e:
                if "Duplicate column name" in str(e):
                    print("return_by_time column already exists")
                else:
                    raise e
            
            # Only initialize if tables don't exist
            cursor.execute("SHOW TABLES LIKE 'person'")
            if not cursor.fetchone():
                print("Initializing database...")
                with open('init.sql', 'r') as sql_file:
                    sql_commands = sql_file.read().split(';')
                    for command in sql_commands:
                        if command.strip():
                            cursor.execute(command)
                connection.commit()
                print("Database initialized successfully")
            else:
                print("Database already initialized")
        
        return True
    
    except Exception as e:
        print(f"Error with database: {e}")
        return False
    
    finally:
        if 'connection' in locals():
            connection.close()

def main():
    # Get credentials (from file or user input)
    username, password = get_credentials()
    
    # Start MySQL if it's not already running
    if not start_mysql():
        return
    
    # Wait for MySQL to fully start
    time.sleep(2)
    
    # Initialize database
    if not initialize_database(username, password):
        return
    
    # Set environment variables for Flask
    os.environ['DATABASE_URL'] = f'mysql://{username}:{password}@localhost:3306/cart_management'
    
    # Create and run Flask app
    app = create_app()
    app.run(debug=True)

if __name__ == '__main__':
    main() 