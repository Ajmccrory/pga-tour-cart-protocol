from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
import pymysql

pymysql.install_as_MySQLdb()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    
    from app.routes import cart_routes, person_routes
    app.register_blueprint(cart_routes.bp)
    app.register_blueprint(person_routes.bp)
    
    return app 