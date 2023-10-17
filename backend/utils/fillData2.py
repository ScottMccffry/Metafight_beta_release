import os
import sys
import random
import json
from decimal import Decimal
import requests
from faker import Faker
from web3 import Web3
from web3.exceptions import BadFunctionCallOutput

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from werkzeug.security import generate_password_hash
from app.models import Fighter, Fight, Bets, NFTcollections, NFTmarketplace, Users, Transactions, GameStatistics
infura_url = "https://mainnet.infura.io/v3/3b8a940c053f4a36808441997eeefa71"
w3 = Web3(Web3.HTTPProvider(infura_url))

contract_address = w3.to_checksum_address("0x8AEA957e2435F87681329b891344a0d341026B88")

# This is a simplified ABI to interact with the contract
abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"approved","type":"address"},{"indexed":True,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"operator","type":"address"},{"indexed":False,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":False,"internalType":"address","name":"to","type":"address"},{"indexed":False,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20PaymentReleased","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":True,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"address","name":"account","type":"address"},{"indexed":False,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"PayeeAdded","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"address","name":"from","type":"address"},{"indexed":False,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"address","name":"to","type":"address"},{"indexed":False,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReleased","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"from","type":"address"},{"indexed":True,"internalType":"address","name":"to","type":"address"},{"indexed":True,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"_setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"airdrop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deactivatePublicSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"firstWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"firstWithdrawRemaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipGivewayClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipPublicSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipRevealed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipWhitelistSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"givewayClaimActivated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"},{"internalType":"uint256","name":"_alloc","type":"uint256"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"givewayMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"givewaysClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"payee","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"publicMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"publicSaleActivated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"publicSaleClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"publicSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"salePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"setFirstWithdrawRemaining","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"setPublicSupply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"setSalePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"setSignerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"}],"name":"setTotalPublicSaleClaimable","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPublicSaleClaimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPublicSaleClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelistClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nb","type":"uint256"},{"internalType":"uint256","name":"_alloc","type":"uint256"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"whitelistMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"whitelistSaleActivated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
contract = w3.eth.contract(address=contract_address, abi=abi)

# Create Flask app instance
app = create_app()

# Create Faker instance for generating fake data
fake = Faker()
abi_str = json.dumps(abi)
# Add NFT collection
divine_assembly = {
    "id": 1,
    "address": contract_address,
    "abi": abi_str,
    "name": "Divine Assembly",
    "description": "Description of Divine Assembly"
}

# Add fighters from NFT collection
fighters = []  # Define the list outside the loop
for token_id in range(1, 50):
    try:
        token_uri = contract.functions.tokenURI(token_id).call()
        owner = contract.functions.ownerOf(token_id).call()
    
        response = requests.get(token_uri)
        metadata = response.json()
        image_url = metadata['image']
        print(f"Fetched data for NFT with token id: {token_id}")
        print(f"Owner: {owner}")
        print(f"Metadata: {metadata}")

        fighter = {
            "id": token_id,
            "name": fake.name(),
            "collection_address": divine_assembly["address"],
            "image": image_url,
            "owner_nft_address": owner, 
            "nft_address": f'{divine_assembly["address"]}_{token_id}',  
            "game_characteristics_json": f'/pathtocollectiongamedirectory/{divine_assembly["address"]}/{token_uri}.def',  
            "rank": random.randint(1, 100),
            "handler": fake.word(ext_word_list=None)
        } 

        fighters.append(fighter)  # Append the fighter to the list
    
    except BadFunctionCallOutput:
        continue  # This token ID does not exist, so we skip it

def add_to_db(objects, Model):
    for obj in objects:
        try:
            new_obj = Model(**obj)
            db.session.add(new_obj)
            db.session.commit()
        except Exception as e:
            print(f"Error adding {Model.__name__}: {e}")
            db.session.rollback()
    print(f"Added all {Model.__name__} objects.")
    
    
with app.app_context():
    
    add_to_db([divine_assembly], NFTcollections)
    print(f"Added Divine assembly")
    add_to_db(fighters, Fighter)
    
    nft_owners=Fighter.query.with_entities(Fighter.owner_nft_address).all()
    unique_nft_owners = set(nft_owner[0] for nft_owner in nft_owners) 

    users = []  # Prepare users list
    for i, owner_nft_address in enumerate(unique_nft_owners):
        user = {
            "id": i+1,
            "username": fake.user_name(),
            "walletAddress": owner_nft_address,  # Use owner's NFT address as user's wallet address
            "email": fake.email(),
            "image": fake.image_url(),
            "funds": round(random.uniform(100, 10000), 1),
            "password": "password"  # Replace "defaultPassword" with your chosen password
        }
        users.append(user)  # Append user to list

    add_to_db(users, Users)  # Add users to the database

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
        "wallet_address": fake.uuid4(),
    }
    for i in range(100)
]

transactions = []
for i in range(100):
    # Combine the user wallet addresses and betting pool ids into one list
    all_addresses = user_wallet_addresses + betting_pool_ids

    # Choose the fromWalletaddress randomly from all_addresses
    from_wallet_address = random.choice(all_addresses)[0]

    # Choose a fight
    fight = random.choice(fights)

    # If the fromWalletaddress is a betting pool id, the toWalletaddress should be the other betting pool id
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

# Continue with the rest of your original code for generating and adding fights, game statistics, marketplace items, bets, and transactions
