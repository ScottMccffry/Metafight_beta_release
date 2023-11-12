# models.py
from datetime import datetime
from app.database import db

class Pending(db.Model):
    __tablename__ = 'pending'

    id = db.Column(db.Integer, primary_key=True)
    nft_address= db.Column(db.String(50), nullable=False, unique=True)
    characteristics = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    request_type = db.Column(db.Integer)
    status = db.Column(db.String(50), nullable=False, default='pending')  # 'pending', 'confirmed', or 'failed'

    def __init__(self, characteristics):
        self.characteristics = characteristics

    def commit_mint(self):
        # Logic to commit the mint, potentially moving it to a confirmed state
        self.transaction_hash = 'your_transaction_hash_here'
        self.status = 'confirmed'
        db.session.commit()
        pass

    def rollback_mint(self):
        # Logic to rollback the mint if necessary
        mint_entry = Pending.query.get(mint_id)
        if mint_entry:
            # Update the mint entry to reflect the rollback
            mint_entry.status = 'rollback'
            db.session.commit()

    def update_pending_mint_status(mint_id, status):
        pending_mint = Pending.query.get(mint_id)
        if pending_mint:
            pending_mint.status = status
            db.session.commit()

    def commit_stake(self):
        pass
    def rollback_stake(self):
        pass