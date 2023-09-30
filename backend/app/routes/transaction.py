from flask import Blueprint, jsonify, request, current_app
from app.models import Bets, Users
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from web3 import Web3
from app.database import db

import time

web3 = Web3(Web3.HTTPProvider("http://localhost:8545"))  # Assuming your Ethereum node is running locally
limiter = Limiter(key_func=get_remote_address)

transaction_routes = Blueprint('transaction_routes', __name__)


@transaction_routes.route('/api/deposit_credits', methods=['POST'])
@limiter.limit("10/day") 
def deposit_credits():
    try:
        data = request.get_json()
        user_id = data['user_id']
        transaction_hash = data['transaction_hash']
        amount = data['amount']

        # Wait for transaction confirmations before proceeding
        wait_for_confirmations(transaction_hash, 6)  # Wait for 6 confirmations

        # Fetch user and update their credits
        user = Users.query.get(user_id)
        if user:
            user.credits += amount  # add deposit amount to user's credits
            db.session.commit()  # save changes to the database

        return jsonify(success=True)
    except Exception as e:
        # Log error and return a user-friendly message
        print(f"Error occurred: {e}")
        return jsonify(success=False, error=str(e)), 500
    
def wait_for_confirmations(transaction_hash, num_confirmations):
    while True:
        transaction = Web3.eth.getTransaction(transaction_hash)
        latest_block = Web3.eth.blockNumber
        if latest_block - transaction['blockNumber'] >= num_confirmations:
            return
        time.sleep(1)  # Wait a bit before trying again
        
def wait_for_confirmations(transaction_hash, num_confirmations):
    provider = providers.JsonRpcProvider("http://localhost:8545")  # This assumes you're connecting to a local Ethereum node. Modify the URL if needed.

    while True:
        transaction = provider.getTransaction(transaction_hash)
        latest_block = provider.getBlockNumber()

        if latest_block - transaction['blockNumber'] >= num_confirmations:
            return
        time.sleep(1)