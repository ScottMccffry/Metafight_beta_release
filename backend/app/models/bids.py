from app.database import db
from datetime import datetime
import json

class Bids(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bid_amount = db.Column(db.Float, nullable=False)
    user_nft_address = db.Column(db.String(255), db.ForeignKey('users.walletAdress'), nullable=False)
    marketplace_item_id = db.Column(db.Integer, db.ForeignKey('NFTmarketplace.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('Users', foreign_keys=[user_nft_address])
    marketplace_item = db.relationship('NFTmarketplace', foreign_keys=[marketplace_item_id])

    def to_dict(self, include_user=True, include_marketplace_item=True):
        data = {
            'id': self.id,
            'bid_amount': self.bid_amount,
            'user_nft_address': self.user_nft_address,
            'marketplace_item_id': self.marketplace_item_id,
            'timestamp': self.timestamp.isoformat() + 'Z',  # Convert to ISO 8601 format
        }

        if include_user:
            data['user'] = self.user.to_dict() if self.user else None

        if include_marketplace_item:
            data['marketplace_item'] = self.marketplace_item.to_dict() if self.marketplace_item else None

        return data
