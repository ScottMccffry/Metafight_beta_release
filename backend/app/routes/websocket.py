# File: websocket_routes.py
import requests
from flask_socketio import SocketIO, send, emit
from app.models import NFTmarketplace
from app.services.oddCalculator import oddCalculator
from app.database import db

socketio = SocketIO()

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('request_update_bid')
def handle_request_live_bid(bid_data):
    if bid_data:
        nft_address = bid_data.get('nft_address')
        bid_value = bid_data.get('bid_value')
        print(f"Received request to update live bid for nft {nft_address}")
        emit('update_live_bid', {'nft_address': nft_address, 'bid_value': bid_value})
    
@socketio.on('request_update_odd')
def handle_request_update(fight_data):
    print('Received fight_data: ', fight_data) # Add this line
    fight_id = fight_data.get('fight_id')
    selected_fighter = fight_data.get('selected_fighter')
    if fight_id:
        print(f"Received request to update odds for fight {fight_id}")
        odds = oddCalculator.calculate_odds(fight_id, selected_fighter)
        emit('update_odd', {'fight_id': fight_id, 'odds': odds, 'selected_fighter': fight_data.get('selected_fighter'), 'fighter1': fight_data.get('fighter1'), 'fighter2': fight_data.get('fighter2')})

    else:
        print("Unable to fetch game statistics.")