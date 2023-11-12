# app.py
from flask import request, jsonify, Blueprint
from app.models import db, Pending

pending_routes = Blueprint('collection_routes', __name__)

@pending_routes.route('/api/mint_request/', methods=['POST'])
def receive_mint_request():
    characteristics = request.json.get('characteristics')
    new_mint = Pending(characteristics=characteristics)
    db.session.add(new_mint)
    db.session.commit()
    return jsonify({'status': 'pending', 'id': new_mint.id}), 201

@pending_routes.route('/mint_confirm/<int:mint_id>', methods=['POST'])
def confirm_mint(mint_id):
    pending_mint = Pending.query.get_or_404(mint_id)
    # Assuming a separate function to handle mint confirmation
    pending_mint.commit_mint()
    db.session.commit()
    return jsonify({'status': 'confirmed'}), 200

# Flask route to handle the staking request
@pending_routes.route('/api/stake_request/', methods=['POST'])
def handle_stake_request():
    nft_id = request.json.get('nft_address')
    # Create a new pending staking record in the database
    new_stake = Pending(nft_id=nft_id, status='pending')
    db.session.add(new_stake)
    db.session.commit()

    # Here you can initiate the staking transaction on the blockchain
    # and return a response indicating that the staking request is pending
    return jsonify({'status': 'pending', 'id': new_stake.id}), 201
@pending_routes.route('/api/unstake_request/', methods=['POST'])
def handle_unstake_request():
    # Your code to handle the unstake request goes here
    data = request.json
    # Use the data to perform unstaking logic
    return jsonify({"status": "success", "message": "Unstake request received"}), 200
  # I dont Have a stakeID 
@pending_routes.route('/stake_confirm/<int:stakeId>', methods=['POST'])
def confirm_stake(StakeId):
    pending_stake = Pending.query.get_or_404(stakeId)
    # Assuming a separate function to handle mint confirmation
    pending_stake.commit_stake()
    db.session.commit()
    return jsonify({'status': 'confirmed'}), 200


