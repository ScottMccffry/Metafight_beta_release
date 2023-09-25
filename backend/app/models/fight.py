from app.database import db

class Fight(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fighter1_nft_address = db.Column(db.String(255), db.ForeignKey('fighter.nft_address'), nullable=False)
    fighter2_nft_address = db.Column(db.String(255), db.ForeignKey('fighter.nft_address'), nullable=False)
    odd1 = db.Column(db.Float, nullable=False)
    odd2 = db.Column(db.Float, nullable=False)
    time_left = db.Column(db.Integer, nullable=False)
    #option of adding polymorphic relationship
    betting_pool1_id= db.Column(db.Integer , nullable=False, unique=True)
    betting_pool2_id = db.Column(db.Integer, nullable=False, unique=True)
    betting_pool1 = db.Column(db.Integer, nullable=False, default=0) 
    betting_pool2 = db.Column(db.Integer, nullable=False, default=0)
    fighter1 = db.relationship('Fighter', foreign_keys=[fighter1_nft_address])
    fighter2 = db.relationship('Fighter', foreign_keys=[fighter2_nft_address])
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'fighter1_nft_address': self.fighter1_nft_address,
            'fighter2_nft_address': self.fighter2_nft_address,
            'odd1': self.odd1,
            'odd2': self.odd2,   
            'time_left': self.time_left,
            'betting_pool1_id': self.betting_pool1_id,
            'betting_pool2_id': self.betting_pool2_id, 
            'betting_pool1': self.betting_pool1,  
            'betting_pool2': self.betting_pool2, 
            'fighter1': self.fighter1.to_dict() if self.fighter1 else None,
            'fighter2': self.fighter2.to_dict() if self.fighter2 else None
        }
        
        # je pense qu'on peut enlever la save method
def save(self):
    db.session.add(self)
    db.session.flush()

    # Update the fight betting pool
    fight = Fight.query.get(self.fight_id)
    if fight.fighter1_nft_address == self.fighter_nft_address:
        fight.betting_pool1 += self.amount
    else:
        fight.betting_pool2 += self.amount

    db.session.commit()
