import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.models import Fighter
from app.models import NFTmarketplace
from app.database import db
from app.models import Fight

app = create_app()

# Set up an application context
with app.app_context():
    # Fetch all the records from the Fighter table
    fights = NFTmarketplace.query.all()

# Loop through each record and print it out
for fight in fights:
    print("Fighter1 ID: {fight.fighter1_id}, Fighter2 ID: {fight.fighter2_id}, Odd1: {fight.odd1}, Odd2: {fight.odd2}")



    