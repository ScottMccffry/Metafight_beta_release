from flask import Blueprint, jsonify
from app.models import NFTmarketplace
from flask import request
from app.database import db

marketplace_routes = Blueprint('marketplace_routes', __name__)


@marketplace_routes.route('/api/marketItems', methods=['GET'])
def get_items():
    items = NFTmarketplace.query.all()
    items_list = [item.to_dict() for item in items]
    return jsonify(items_list)

@marketplace_routes.route('/marketplace-item/<nft_address>', methods=['GET'])
def get_marketplace_item(nft_address):
    # concatenate nft_address and token_id
  

    item = NFTmarketplace.query.filter_by(nft_address=nft_address).first()
   
    print(f"item: {item}")
    if not item:
        return {"error": "Marketplace item not found"}, 404
    return jsonify(item.to_dict()), 200

@marketplace_routes.route('/create-marketplace-item', methods=['POST'])
def create_marketplace_item():
    data = request.get_json()
    new_item = NFTmarketplace(
        owner=data['owner'],
        image=data['image'],
        title=data['title'],
        auction=data['auction'],
        timeLeft=data['timeLeft'],
        price=data['price']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@marketplace_routes.route('/update-marketplace-item/<nft_address>', methods=['PUT'])
def update_marketplace_item(id):
    item = NFTmarketplace.query.get(id)
    if not item:
        return {"error": "Marketplace item not found"}, 404

    data = request.get_json()
    item.owner = data.get('owner', item.owner)
    item.image = data.get('image', item.image)
    item.title = data.get('title', item.title)
    item.auction = data.get('auction', item.auction)
    item.timeLeft = data.get('timeLeft', item.timeLeft)
    item.price = data.get('price', item.price)

    db.session.commit()
    return jsonify(item.to_dict()), 200

@marketplace_routes.route('/delete-marketplace-item/<id>', methods=['DELETE'])
def delete_marketplace_item(id):
    item =  NFTmarketplace.query.get(id)
    if not item:
        return {"error": "Marketplace item not found"}, 404

    db.session.delete(item)
    db.session.commit()
    return {"message": "Marketplace item deleted successfully"}, 200