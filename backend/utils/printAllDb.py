from flask import jsonify
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Bets, Fighter, Fight, FightRequest, NFTcollections, NFTmarketplace, Users
from sqlalchemy.inspection import inspect
import json
from app import create_app

def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}

app = create_app()  # create an instance of your Flask application

with app.app_context():

    data = {
        "bets": [object_as_dict(bet) for bet in Bets.query.all()],
        "fights": [object_as_dict(fight) for fight in Fight.query.all()],
        "fighters": [object_as_dict(fighter) for fighter in Fighter.query.all()],
        "fight_requests": [object_as_dict(fight_request) for fight_request in FightRequest.query.all()],
        "nft_collections": [object_as_dict(nft_collection) for nft_collection in NFTcollections.query.all()],
        "nft_marketplace": [object_as_dict(nft_marketplace) for nft_marketplace in NFTmarketplace.query.all()],
        "users": [object_as_dict(user) for user in Users.query.all()],
    }

    with open('db_data1.json', 'w') as f:
        json.dump(data, f)