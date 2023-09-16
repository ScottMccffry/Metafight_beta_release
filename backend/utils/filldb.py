import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.models import Fighter
from app.database import db

app = create_app()

# Your fighters data
fighters = [
  {
    "name": 'Raven Simmons',
    "collection":'SWC',
    "handler": '@raven',
    "rank":1,
    "image": 'https://assets.codepen.io/3685267/nft-dashboard-pro-1.jpg',
    "nft_address":'yoyo0',
    "game_characteristics":'yoyo',
    "dna":'yoyo',
  },
  {
    "name": 'Uriah Gardner',
    "collection":'DA',
    "handler": '@uriah',
    "rank":3,
    "image": 'https://assets.codepen.io/3685267/nft-dashboard-pro-2.jpg',
    "nft_address":'yoyo1',
    "game_characteristics":'yoyo',
    "dna":'yoyo',
  },
  {
    "name": 'Colin Mitchell',
    "collection":'DA',
    "handler": '@colin',
    "rank":2,
    "image": 'https://assets.codepen.io/3685267/nft-dashboard-pro-4.jpg',
    "nft_address":'yoyo2',
    "game_characteristics":'yoyo',
    "dna":'yoyo',
  },
  {
    "name": 'Emely Hall',
    "collection":'SWC',
    "handler": '@emely',
    "rank":5,
    "image": 'https://assets.codepen.io/3685267/nft-dashboard-pro-3.jpg',
    "nft_address":'yoyo3',
    "game_characteristics":'yoyo',
    "dna":'yoyo',
  },
  {
    "name": 'Raphael Scott',
    "collection":'SWC',
    "handler": '@raphael',
    "rank":4,
    "image": 'https://assets.codepen.io/3685267/nft-dashboard-pro-5.jpg',
    "nft_address":'yoyo4',
    "game_characteristics":'yoyo',
    "dna":'yoyo',
  },
];

with app.app_context():
    for fighter in fighters:
        try:
            # Create a new fighter instance with the data
            new_fighter = Fighter(
                name=fighter["name"],
                collection=fighter["collection"],
                handler=fighter["handler"],
                image=fighter["image"],
                rank=fighter["rank"],
                nft_address=fighter["nft_address"],
                game_characteristics=fighter["game_characteristics"],
                dna=fighter["dna"],
            )
            # Add the new fighter to the database session
            db.session.add(new_fighter)
            # Commit the session to save the changes
            db.session.commit()
            print(f"Added fighter: {fighter['name']}")
        except Exception as e:
            print(f"Error adding new fighter: {e}")
            db.session.rollback()
