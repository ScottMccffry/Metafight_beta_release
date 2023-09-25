from flask import Blueprint, jsonify
from app.models import Users, NFTmarketplace, Fight, Fighter, FightRequest, NFTcollections
from flask import request
from app.database import db
import os
import base64
import threading
#import main  # This assumes that there's a main.py file in the same directory



general_routes = Blueprint('general_routes', __name__)

#@app.route('/start_game', methods=['POST'])
#def start_game():
 #   subprocess.call(['python', '/path/to/your/pygame_script.py'])
 #   return {"status": "Game started"}, 200
@general_routes.route('/api/request_fight', methods=['POST'])
def request_fight():
    data = request.json
    player_id = data['player_id']
    fighter_id = data['fighter_id']

    # Create a new fight request
    new_request = FightRequest(player_id=player_id, fighter_id=fighter_id)
    db.session.add(new_request)
    db.session.commit()

    # Check if there's an existing fight request that can be matched
    opponent_request = FightRequest.query.filter(FightRequest.id != new_request.id).first()

    if opponent_request:
        # Create a new fight with the matched players and fighters
        new_fight = Fight(fighter1_id=new_request.fighter_id, fighter2_id=opponent_request.fighter_id, odd1=1.0, odd2=1.0, time_left=0, price=0)
        db.session.add(new_fight)

        # Remove the matched fight requests
        db.session.delete(new_request)
        db.session.delete(opponent_request)

        db.session.commit()

        return jsonify({"message": "Fight created", "fight_id": new_fight.id})

    return jsonify({"message": "Fight request created", "request_id": new_request.id})

@general_routes.route('/api/nft_collections', methods=['GET'])
def get_nftcollections():
    nftcollections = NFTcollections.query.all()
    nftcollection_data = []

    for nftcollection in nftcollections:
        nftcollection_data.append({
            "id": nftcollection.id,
            "address": nftcollection.address,
            "abi": nftcollection.abi,
            "name": nftcollection.name
        })

    return jsonify(nftcollection_data)
  



















#@general_routes.route('/api/start-game', methods=['POST'])
#def start_game():
#    game_thread = threading.Thread(target=run_game)
#    game_thread.start()
#    return jsonify({'status': 'Game started'})

