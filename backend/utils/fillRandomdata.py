import random
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from faker import Faker
from app.models import Fighter, Fight, Bets, NFTcollections, NFTmarketplace, Users
app = create_app()
fake = Faker()

# random data for fighters
fighters = [
    {
        "id": i,
        "name": fake.name(),
        "collection": fake.word(ext_word_list=None),
        "image": fake.image_url(),
        "owner_id": random.choice(Users)['id'],
        "nft_address": fake.uuid4(),
        "game_characteristics":random.randint(1, 100),
        
        "rank": random.randint(1, 100),
        "handler": fake.word(ext_word_list=None)
    } for i in range(5)
]

# random data for fights
fights = [
    {
        "id": i,
        "fighter1_id": random.choice(fighters)['id'],
        "fighter2_id": random.choice(fighters)['id'],
        "odd1": round(random.uniform(1, 3), 1),
        "odd2": round(random.uniform(1, 3), 1),
        "time_left": random.randint(3600, 18000),
    } for i in range(5)
]

# random data for bets
bets = [
    {
        "id": i,
        "fight_id": random.choice(fights)['id'],
        "fighter_id": random.choice(fighters)['id'],
        "amount": random.randint(100, 1000),
        "odd": round(random.uniform(1, 3), 1),
        "wallet_adress": fake.uuid4(),
    } for i in range(10)
]

# random data for NFT collections
nft_collections = [
    {
        "id": i,
        "address": fake.uuid4(),
        "abi": fake.uuid4(),
        "name": fake.word(ext_word_list=None),
        "description": fake.sentence(nb_words=6)
    } for i in range(3)
]

# random data for NFT marketplace
nft_marketplace = [
    {
        "id": i,
        "nft_adress": fake.uuid4(),
        "fighter_id": random.choice(fighters)['id'],  # Added fighter_id
        "auction": random.choice([True, False]),
        "timeLeft": random.randint(1, 10000000),
        "price": round(random.uniform(1, 10), 1)
    } for i in range(5)
]

# random data for users



def add_to_db(objects, Model):
    for obj in objects:
        try:
            new_obj = Model(**obj)
            db.session.add(new_obj)
            db.session.commit()
            print(f"Added {Model.__name__}: {obj}")
        except Exception as e:
            print(f"Error adding {Model.__name__}: {e}")
            db.session.rollback()

with app.app_context():
    add_to_db(fighters, Fighter)
    add_to_db(fights, Fight)
    add_to_db(bets, Bets)
    add_to_db(nft_collections, NFTcollections)
    add_to_db(nft_marketplace, NFTmarketplace)
    add_to_db(Users, Users)
