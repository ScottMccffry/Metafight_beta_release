from app.database import db
from datetime import datetime

class FightRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, nullable=False)
    fighter_id = db.Column(db.Integer, db.ForeignKey('fighter.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    fighter = db.relationship('Fighter')    
