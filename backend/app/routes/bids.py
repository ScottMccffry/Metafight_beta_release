from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Bids, Users, NFTmarketplace

bid_routes = Blueprint('bid_routes', __name__)
@bid_routes.route('/api/place_bid', methods=['POST'])
def place_bid():
    data = request.get_json()

    print(f"Received data: {data}")  # Print the data received from the client

    bid_amount = data.get('bid_amount')
    user_nft_address = data.get('user_nft_address')
    marketplace_item_id = data.get('marketplace_item_id')

    if not all([bid_amount, user_nft_address, marketplace_item_id]):
        return jsonify({'success': False, 'message': 'Missing required data'}), 400

    print(f"Looking for user with nft_address: {user_nft_address}")  # Print the nft_address being searched for

    user = Users.query.filter_by(walletAdress=user_nft_address).first()
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404

    print(f"Found user: {user}")  # Print the user that was found

    if user.funds < bid_amount: #change funds to balance
        return jsonify({'success': False, 'message': 'Insufficient balance'}), 400

    print(f"Looking for marketplace item with id: {marketplace_item_id}")  # Print the id being searched for

    item = NFTmarketplace.query.filter_by(id=marketplace_item_id).first()
    if not item:
        return jsonify({'success': False, 'message': 'Marketplace item not found'}), 404

    print(f"Found marketplace item: {item}")  # Print the item that was found

    user.funds -= bid_amount
    item.price = bid_amount

    new_bid = Bids(
        bid_amount=bid_amount,
        user_nft_address=user_nft_address,
        marketplace_item_id=marketplace_item_id
    )

    db.session.add(new_bid)
    try:
        db.session.commit()
        print("Bid placed, transaction recorded, and balances updated successfully!")  # Print success message
        return jsonify({'success': True, 'message': 'Bid placed, transaction recorded, and balances updated successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error placing bid: {str(e)}")  # Print the error that occurred
        return jsonify({'success': False, 'message': 'Failed to place bid.'}), 500
