from app.database import db

class fighterspecs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fighterId = db.Column(db.Integer, db.ForeignKey('fighter.id'))
    totalGames = db.Column(db.Integer, nullable=False)
    totalWinsFighter1 = db.Column(db.Integer, nullable=False)
    sound_url = db.Column(db.String(255), nullable=False)
    sprite_sheet_url = db.Column(db.String(255), nullable=False)
    animation_steps = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    scale = db.Column(db.Integer, nullable=False)
    offset = db.Column(db.String(255), nullable=False)
    league = db.Column(db.String(255), nullable=False)
    

    def __repr__(self):
        return f"GameStatistics('{self.id}', '{self.fightId}', '{self.totalGames}', '{self.totalWinsFighter1}', '{self.totalWinsFighter2}')"

    def to_dict(self):
        return {
            "id": self.id,
            "fightId": self.fightId,
            "totalGames": self.totalGames,
            "totalWinsFighter1": self.totalWinsFighter1,
        }
        