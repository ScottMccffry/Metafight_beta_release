from app.database import db

class Transactions(db.Model):
    id = db.Column(db.Integer, unique=True, primary_key=True)
    #option of adding polymorphic relationship
    #but first we do without foreign key
    fromWalletAdress = db.Column(db.String(255), nullable=False)
    toWalletAdress = db.Column(db.String(255), nullable=False)
    amount= db.Column(db.Integer, nullable=False)
    
    
    def to_dict(self):
        return {
            'fromWalletAdress': self.fromWalletAdress,
            'toWalletAdress': self.toWalletAdress,
            'amount': self.amount
        }
            