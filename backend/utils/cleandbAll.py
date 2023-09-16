import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.models import Fighter
from app.database import db

app = create_app()

with app.app_context():
    try:
        # Delete all fighters
        num_rows_deleted = db.session.query(Fighter).delete()

        # Commit the session to save the changes
        db.session.commit()
        print(f"{num_rows_deleted} fighters were deleted.")
    except Exception as e:
        print(f"Error deleting fighters: {e}")
        db.session.rollback()
