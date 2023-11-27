# models.py
from datetime import datetime
from app.database import db

class Pending(db.Model):
    __tablename__ = 'pending'

    id = db.Column(db.Integer, primary_key=True)
    nft_address= db.Column(db.String(50), nullable=False)# add Unique if necessary, unique=True)
    data_to_validate = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    request_type = db.Column(db.Integer)
    status = db.Column(db.String(50), nullable=False, default='pending')  # 'pending', 'confirmed', or 'failed'

    def __init__(self, nft_address, data_to_validate, request_type, status='pending'):
            self.nft_address = nft_address
            self.data_to_validate = data_to_validate
            self.request_type = request_type
            self.status = status

    def commit_mint(self):
        # Logic to commit the mint, potentially moving it to a confirmed state
        self.transaction_hash = 'your_transaction_hash_here'
        self.status = 'confirmed'
        db.session.commit()
        return self.id
    
    @staticmethod
    def rollback_mint(pending_id):
        # Logic to rollback the mint if necessary
        pending_entry = Pending.query.get(pending_id)
        if pending_entry:
            # Update the mint entry to reflect the rollback
            db.session.delete(pending_entry)
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