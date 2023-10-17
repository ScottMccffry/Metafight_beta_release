from app.models import Fighter
from app.database import db

# Get the fighter instance you want to delete
fighter_id_to_delete = 1
fighter_to_delete = Fighter.query.get(fighter_id_to_delete)

if fighter_to_delete:
    try:
        # Delete the fighter from the database session
        db.session.delete(fighter_to_delete)

        # Commit the session to save the changes
        db.session.commit()
    except Exception as e:
        print(f"Error deleting fighter: {e}")
        db.session.rollback()
else:
    print("Fighter not found")
