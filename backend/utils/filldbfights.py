import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.models import Fight
from app.database import db

app = create_app()

# Your fighters data
fights = [
    {
        "fighter1_id": 1,
        "fighter2_id": 2,
        "odd1": 1.5,
        "odd2": 2.5,
        "time_left": 3600  # 1 hour
    },
    {
        "fighter1_id": 3,
        "fighter2_id": 4,
        "odd1": 2.0,
        "odd2": 1.8,
        "time_left": 7200  # 2 hours
    },
    {
        "fighter1_id": 5,
        "fighter2_id": 1,
        "odd1": 1.7,
        "odd2": 2.1,
        "time_left": 10800  # 3 hours
    },
    {
        "fighter1_id": 2,
        "fighter2_id": 3,
        "odd1": 1.9,
        "odd2": 1.9,
        "time_left": 14400  # 4 hours
    },
    {
        "fighter1_id": 4,
        "fighter2_id": 5,
        "odd1": 2.2,
        "odd2": 1.6,
        "time_left": 18000  # 5 hours
    }
]


with app.app_context():
    for fight in fights:
        try:
            # Create a new fight instance with the data
            new_fight = Fight(
                fighter1_id=fight["fighter1_id"],
                fighter2_id=fight["fighter2_id"],
                odd1=fight["odd1"],
                odd2=fight["odd2"],
                time_left=fight["time_left"]
            )
            # Add the new fight to the database session
            db.session.add(new_fight)
            # Commit the session to save the changes
            db.session.commit()
            print(f"Added fight: {new_fight.id}")
        except Exception as e:
            print(f"Error adding new fight: {e}")
            db.session.rollback()

