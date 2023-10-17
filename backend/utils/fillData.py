import random
import json
import sys
import os
from decimal import Decimal
from faker import Faker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app, db
from werkzeug.security import generate_password_hash
from faker import Faker
from app.models import Fighter, Fight, Bets, NFTcollections, NFTmarketplace, Users, Transactions, GameStatistics
app = create_app()
fake = Faker()

# random data for users
users = [
    {
        "id": i+1,
        "username": fake.user_name(),
        "walletAddress": fake.uuid4(),
        "email": fake.email(),
        "image": fake.image_url(),
        "funds": round(random.uniform(100, 10000), 1)
    } for i in range(100)
]

# Commit users to database first so we can link them to fighters
def add_to_db(objects, Model):
    for obj in objects:
        try:
            new_obj = Model(**obj)
            #new_obj.password = fake.password(length=10, special_chars=True, digits=True, upper_case=True, lower_case=True)
            new_obj.password = "password"
            db.session.add(new_obj)
        except Exception as e:
            print(f"Error adding {Model.__name__}: {e}")
            db.session.rollback()
    db.session.commit()
    print(f"Added all {Model.__name__} objects.")

# random data for NFT collections
nft_collections = [
    {
        "id": i+1,
        "address": fake.uuid4(),
        "abi": fake.uuid4(),
        "name": fake.word(ext_word_list=None),
        "description": fake.sentence(nb_words=6)
    } for i in range(5)
]


with app.app_context():
    add_to_db(users, Users)
    add_to_db(nft_collections, NFTcollections)

    # Get all user ids
    user_ids = Users.query.with_entities(Users.id).all()
    nft_collections_addresses = NFTcollections.query.with_entities(NFTcollections.address).all()
# random data for fighters
fighters = [
    {
        "id": i+1,
        "name": fake.name(),
        "collection_address": random.choice(nft_collections_addresses)[0],
        "image": fake.image_url(),
        "owner_id": random.choice(user_ids)[0],
        "nft_address": fake.uuid4(),
        "game_characteristics_json":random.randint(1, 100),
        "rank": random.randint(1, 100),
        "handler": fake.word(ext_word_list=None)
    } for i in range(50)
]
# Commit fighters to database first so we can link them to fights and NFTmarketplace
with app.app_context():
    add_to_db(fighters, Fighter)

# Get all fighter ids
    fighter_nft_addresses = Fighter.query.with_entities(Fighter.nft_address).all()
    user_wallet_addresses = Users.query.with_entities(Users.walletAddress).all()
    betting_pool_ids = Fight.query.with_entities(Fight.betting_pool1_id, Fight.betting_pool2_id).all()
# random data for fights
# random data for GameStatistics
game_statistics = [
    {
        "id": i+1,
        "totalGames": (total_games:=random.randint(1, 100)),
        "totalWinsFighter1": (total_wins_fighter1:=random.randint(1, total_games)),
        "totalWinsFighter2": total_games - total_wins_fighter1
    } for i in range(20)
]

# data for fights
fights = []
for i, game_statistic in enumerate(game_statistics):
    # calculate the odds based on the game statistics
    number_of_games = game_statistic['totalGames']
    number_of_wins_fighter1 = game_statistic['totalWinsFighter1']


    # Win percentage based on past games
    win_percentage = round(number_of_wins_fighter1 / number_of_games,1)
        
    # Calculate odds
    # c'est pas parfait cet ajustement on se demande pourquoi il y a 1 ou 0 en pourcentage de victoire ??, 
    if win_percentage==0:
        odd_fighter1 = 1 / (win_percentage + 0.1)
        odd_fighter2 = 1 / (1 - win_percentage + 0.1)
    elif win_percentage==1:
        odd_fighter1 = 1 / win_percentage
        odd_fighter2 = 1 / (1 - win_percentage + 0.1)
    else:
        odd_fighter1 = 1/ win_percentage
        odd_fighter2 = 1 / (1 - win_percentage)

    # Add a 4% layer for the website's long-term winnings
    odd_fighter1_with_layer = round(odd_fighter1 *1.04,1)
    odd_fighter2_with_layer = round(odd_fighter2 * 1.04,1)

    fight = {
        "id": i+1,
        "fighter1_nft_address": random.choice(fighter_nft_addresses)[0],
        "fighter2_nft_address": random.choice(fighter_nft_addresses)[0],
        "odd1": odd_fighter1_with_layer,
        "odd2": odd_fighter2_with_layer,
        "time_left": random.randint(3600, 18000),
        "betting_pool1_id": i * 2,
        "betting_pool2_id": i * 2 + 1,
        "betting_pool1": 0,
        "betting_pool2": 0
    }

    fights.append(fight)

# add 'fight_id' to game_statistics after fights are created
for i, game_statistic in enumerate(game_statistics):
    game_statistic["fight_id"] = fights[i]["id"]

# random data for NFT marketplace
nft_marketplace = [
    {
        "id": i+1,
        "nft_address": random.choice(fighter_nft_addresses)[0],  # Added fighter_id
        "auction": random.choice([True, False]),
        "timeLeft": random.randint(1, 10000000),
        "price": round(random.uniform(1, 10), 1)
    } for i in range(15)
]

# random data for bets

bets = [
    {
        "id": i+1,
        "fight_id": (fight:=random.choice(fights))['id'],
        "fighter_nft_address": random.choice([fight['fighter1_nft_address'], fight['fighter2_nft_address']]),
        "amount": random.randint(100, 1000),
        "odd": round(random.uniform(1, 3), 1),
        "wallet_Address": fake.uuid4(),
    }
    for i in range(100)
]

transactions = []
for i in range(100):
    # Combine the user wallet addresses and betting pool ids into one list
    all_addresses = user_wallet_addresses + betting_pool_ids

    # Choose the fromWalletAddress randomly from all_addresses
    from_wallet_address = random.choice(all_addresses)[0]

    # Choose a fight
    fight = random.choice(fights)

    # If the fromWalletAddress is a betting pool id, the toWalletAddress should be the other betting pool id
    if from_wallet_address == fight['betting_pool1_id']:
        to_wallet_address = fight['betting_pool2_id']
    elif from_wallet_address == fight['betting_pool2_id']:
        to_wallet_address = fight['betting_pool1_id']
    # Otherwise, the toWalletAddress can be any address from all_addresses
    else:
        to_wallet_address = random.choice(all_addresses)[0]
    
    transactions.append({
        "id": i+1,
        "fromWalletAddress": from_wallet_address,
        "toWalletAddress": to_wallet_address,
        "amountIn": random.randint(100, 1000),
        "amountOut": random.randint(100, 1000),
    })

def add_marketplace_item(nft_address, auction, timeLeft, price):
    existing_item = NFTmarketplace.query.filter_by(nft_address=nft_address).first()
    if existing_item:
        # Update existing item
        existing_item.auction = auction
        existing_item.timeLeft = timeLeft
        existing_item.price = price
    else:
        # Create new item
        new_item = NFTmarketplace(nft_address=nft_address, auction=auction, timeLeft=timeLeft, price=price)
        db.session.add(new_item)
    db.session.commit()

    
with app.app_context():
    add_to_db(fights, Fight)
    add_to_db(game_statistics, GameStatistics)
    for item in nft_marketplace:
        try:
            add_marketplace_item(item['nft_address'], item['auction'], item['timeLeft'], item['price'])
            print(f"Added/updated NFTmarketplace: {item}")
        except Exception as e:
            print(f"Error adding/updating NFTmarketplace: {e}")
            db.session.rollback()
    add_to_db(bets, Bets)
