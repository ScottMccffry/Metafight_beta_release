from flask import Blueprint, jsonify, request
from app.models import Bets, Users, Fight, Transactions
from app.services.oddCalculator import oddCalculator
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from web3 import Web3
from app.database import db
web3 = Web3(Web3.HTTPProvider("http://localhost:8545"))  # Assuming your Ethereum node is running locally
limiter = Limiter(key_func=get_remote_address)

bets_routes = Blueprint('bets_routes', __name__)

@bets_routes.route('/api/betshistory/<fight_id>', methods=['GET'])
def get_bets_history(fight_id):
    print(f"fight_id: {fight_id}")
    bets = Bets.query.filter_by(fight_id=fight_id).all()
    bets_list = [bet.to_dict() for bet in bets]
    return jsonify(bets_list)

@bets_routes.route('/api/odds/<fight_id>', methods=['GET'])
def get_odds(fight_id):
    print(f"fight_id: {fight_id}")
    game_statistics = oddCalculator.fetch_game_statistics_temp(fight_id)
    if game_statistics is None:
        print("Game statistics not found")
        return jsonify({'error': 'Game statistics not found'}), 404
    odds = oddCalculator.calculate_odds(game_statistics)
    if odds is None:
        print("Odds could not be calculated")
        return jsonify({'error': 'Odds could not be calculated'}), 400
    return jsonify(odds)

@bets_routes.route('/api/place_bet', methods=['POST'])
def place_bet():
    data = request.get_json()
    print(f"data: {data}")
    # You could add validation here to make sure the necessary data was provided
    if 'fightId' not in data:
        print("Missing fightId in data")
        return jsonify({'error': 'Missing fightId in data'}), 400
    elif 'selectedFighter' not in data:
        print("Missing selectedFighter in data")
        return jsonify({'error': 'Missing selectedFighter in data'}), 400
    elif 'betAmount' not in data:
        print("Missing betAmount in data")
        return jsonify({'error': 'Missing betAmount in data'}), 400
    elif 'odd' not in data:
        print("Missing odd in data")
        return jsonify({'error': 'Missing odd in data'}), 400
    elif 'walletAddress' not in data:
        print("Missing walletAddress in data")
        return jsonify({'error': 'Missing walletAddress in data'}), 400


    print("Data is complete")

    # If using SQLAlchemy
    bet = Bets(
        fight_id=data['fightId'],
        fighter_nft_address=data['selectedFighter'],
        amount=data['betAmount'],
        odd=data['odd'],
        wallet_address=data['walletAddress']
    )
    
    print(f"Created Bet: {bet}")

    # Add the bet and transaction to the session
    db.session.add(bet)
    print("Added bet to the session")

    # Update the fight betting pool
    fight = Fight.query.filter_by(id=data['fightId']).first()
    print(f"Fetched fight: {fight}")
    if fight.fighter1_nft_address == data['selectedFighter']:
        fight.betting_pool1 += data['betAmount']
        print("Updated fight betting_pool1")
        # Create a new transaction for betting pool 1
        transaction = Transactions(
        fromWalletAddress=data['walletAddress'],
        toWalletAddress=fight.betting_pool1_id,  
        amount=data['betAmount']
    )
    else:
        fight.betting_pool2 += data['betAmount']
        print("Updated fight betting_pool2")
        # Create a new transaction for betting pool 2
        transaction = Transactions(
        fromWalletAddress=data['walletAddress'],
        toWalletAddress=fight.betting_pool2_id, 
        amount=data['betAmount']
    )
    
    print(f"Created Transaction: {transaction}")
    db.session.add(transaction)
    print("Added transaction to the session")
    
    # Deduct the bet amount from user's balance
    user = Users.query.filter_by(walletAddress=data['walletAddress']).first()
    print(f"Fetched user: {user}")
    user.funds -= data['betAmount']
    print("Deducted bet amount from user's balance")

    # Commit the changes
    db.session.commit()
    print("Committed changes")

    return jsonify({'success': True, 'betId': bet.id, 'transactionId': transaction.id}), 200
@bets_routes.route('/api/remove_bet', methods=['DELETE'])
def remove_bet():
    data = request.get_json()

    bet_id = data.get('betId')
    wallet_address = data.get('walletAddress') #how does it fethc the wallet address ?
    if not bet_id:
        return jsonify({'message': 'Bet id is required'}), 400

    bet = Bets.query.get(bet_id)
    if not bet:
        return jsonify({'message': 'Bet not found'}), 404
    
    user = Users.query.filter_by(wallet_address=wallet_address).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # If you want to update the fight betting pool, you should do it here
    fight = Fight.query.get(bet.fight_id)
    if fight.fighter1_nft_address == bet.fighter_nft_address:
        fight.betting_pool1 -= bet.amount
    else:
        fight.betting_pool2 -= bet.amount
        
    # Return the bet amount to the user's balance
    user.balance += bet.amount

    db.session.delete(bet)
    db.session.commit()

    return jsonify({'message': 'Bet removed successfully'})