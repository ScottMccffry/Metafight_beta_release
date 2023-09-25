from app import create_app
from app.database import db

app = create_app()

with app.app_context():
    db.drop_all()  # Drop all tables if they exist

    # Import the models here, one by one
    from app.models.user import Users
    Users.__table__.create(bind=db.engine)
    
    from app.models.nftcollections import NFTcollections
    NFTcollections.__table__.create(bind=db.engine)
    
    from app.models.fighter import Fighter
    Fighter.__table__.create(bind=db.engine)

    from app.models.nftmarketplace import NFTmarketplace
    NFTmarketplace.__table__.create(bind=db.engine)

    from app.models.fight import Fight
    Fight.__table__.create(bind=db.engine)

    

    from app.models.fightrequest import FightRequest
    FightRequest.__table__.create(bind=db.engine)

 
    from app.models.bets import Bets
    Bets.__table__.create(bind=db.engine)

    from app.models.transactions import Transactions
    Transactions.__table__.create(bind=db.engine)

    from app.models.gamestatistics import GameStatistics
    GameStatistics.__table__.create(bind=db.engine)

    from app.models.bids import Bids
    Bids.__table__.create(bind=db.engine)