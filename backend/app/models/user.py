from app.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    walletAddress = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), nullable=True)  # Optional
    password_hash = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=True)  # Optional
    funds = db.Column(db.Float, nullable=True, default=0)
    fighters = db.relationship('Fighter', backref='user', lazy=True)  # New relationship

    def to_dict(self):
        return {
            'username': self.username,
            'walletAddress': self.walletAddress,
            'email': self.email,
            'image': self.image,
            'funds': self.funds,
            'fighters': [fighter.to_dict() for fighter in self.fighters]  # Include owned fighters
        }
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)