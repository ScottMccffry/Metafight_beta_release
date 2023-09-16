from app.models import Fighter
from app.database import db

# Drop the Fighter table
try:
    Fighter.__table__.drop(db.session.bind)

    # Commit the session to save the changes
    db.session.commit()
except Exception as e:
    print(f"Error dropping Fighter table: {e}")
    db.session.rollback()
