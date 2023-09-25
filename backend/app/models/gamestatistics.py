from app.database import db

class GameStatistics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fight_id = db.Column(db.Integer, db.ForeignKey('fight.id'), primary_key=True, unique=True)
    totalGames= db.Column(db.Integer, nullable=False, default=0)
    totalWinsFighter1 = db.Column(db.Integer, nullable=False, default=0)
    totalWinsFighter2 = db.Column(db.Integer, nullable=False, default=0)
    fight= db.relationship('Fight', foreign_keys=[fight_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'fightId': self.fightId,
            'totalGames': self.totalGames,
            'totalWinsFighter1': self.totalWinsFighter1,
            'totalWinsFighter2': self.totalWinsFighter2
        }