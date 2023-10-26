from app.database import db
import json

class Fighter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    collection_address = db.Column(db.String(255), db.ForeignKey('nf_tcollections.address'), nullable=True)  # Updated field
    image = db.Column(db.String(255), nullable=False)
    owner_nft_address = db.Column(db.Integer, db.ForeignKey('users.walletAddress'), nullable=True)  # Updated field
    nft_address = db.Column(db.String(255), unique=True, nullable=False)
    marketplace_item = db.relationship('NFTmarketplace', uselist=False, back_populates='fighter')  # Updated relationship
    game_characteristics_json = db.Column(db.String(250), nullable=False)
    handler = db.Column(db.String(255), nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    @property
    def game_characteristics(self):
        return json.loads(self.game_characteristics_json)

    @game_characteristics.setter
    def game_characteristics(self, value):
        self.game_characteristics_json = json.dumps(value)
        
        
    def to_dict(self, include_marketplace_item=True):
        data = {
            'id': self.id,
            'name': self.name,
            'collection_address': self.collection_address if self.collection_address else None,  # Updated line
            'image': self.image,
            'owner_nft_address': self.owner_nft_address,
            'rank': self.rank,
            'nft_address': self.nft_address,
            'game_characteristics_json': self.game_characteristics_json,
            'handler': self.handler
        }
        if include_marketplace_item:
            data['marketplace_item'] = (self.marketplace_item.to_dict(include_fighter=False) if self.marketplace_item else None)
        return data
