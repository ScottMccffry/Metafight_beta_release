from app.database import db

class Bets(db.Model):
    id= db.Column(db.Integer, primary_key=True, unique=True)
    fight_id = db.Column(db.Integer, db.ForeignKey('fight.id'), nullable=False)
    fighter_nft_address = db.Column(db.String(255), db.ForeignKey('fighter.nft_address'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    odd = db.Column(db.Float, nullable=False) 
    wallet_address = db.Column(db.String(42), nullable=False)
         
   #use marshmallow on update
    def to_dict(self):
        return {
            'id': self.id,
            'fight_id': self.fight_id,
            'fighter_nft_address': self.fighter_nft_address,
            'amount': self.amount,
            'odd': self.odd,  
            'wallet_address': self.wallet_address
        }      
