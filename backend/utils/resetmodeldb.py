import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import db, create_app

app = create_app()

with app.app_context():
    
    # drop all tables
    db.drop_all()

    # create all tables from models
    db.create_all()
