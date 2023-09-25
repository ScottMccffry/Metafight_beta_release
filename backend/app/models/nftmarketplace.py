from app.database import db

class NFTmarketplace(db.Model):
    __tablename__ = 'NFTmarketplace'
    id = db.Column(db.Integer, unique=True, primary_key=True)
    nft_address = db.Column(db.String(42), db.ForeignKey('fighter.nft_address'), nullable=False, unique=True) 
    auction = db.Column(db.Boolean , nullable=False, default=True)
    timeLeft = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=True)
    fighter = db.relationship('Fighter', back_populates='marketplace_item',  lazy='joined')  # New relationship
    
    def to_dict(self, include_fighter=True):
        return {
            'id': self.id,
            'nft_address': self.nft_address,
            'auction': self.auction,
            'timeLeft': self.timeLeft,
            'price': self.price,
        }
        if include_fighter:
            data['fighter'] = self.fighter.to_dict(include_marketplace_item=False) if self.fighter else None
        return data