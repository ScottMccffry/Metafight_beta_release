from app.database import db

class NFTcollections(db.Model):
    __tablename__ = 'nf_tcollections' # This should match the actual table name in the database
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False, unique=True)
    abi = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    fighters = db.relationship('Fighter', backref='nft_collections', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'address': self.address,
            'abi': self.abi,
            'name': self.name,
            'description': self.description,
            # 'fighters': [fighter.to_dict() for fighter in self.fighters]
        }