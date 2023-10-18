from flask import Blueprint, jsonify
from app.models import Users, NFTmarketplace, Fight, Fighter, FightRequest, NFTcollections
from flask import request
from app.database import db
import os
import base64
import threading
fighter_routes = Blueprint('fighter_routes', __name__)

@fighter_routes.route('/api/fighters', methods=['GET'])
def get_fighters():
    fighters = Fighter.query.all()
    fighters_list = [fighter.to_dict() for fighter in fighters]
    return jsonify(fighters_list)


@fighter_routes.route('/api/users_fighters_address/<user_wallet_address>', methods=['GET'])
def get_users_fighters_Faddress(user_wallet_address):

    print(f"User Wallet Address: {user_wallet_address}")  # Print the received wallet address

    fighters = Fighter.query.filter_by(owner_nft_address=user_wallet_address).all()
    
    print(f"Fighters: {fighters}")  # Print the returned fighters list after the query

    fighters_list = [fighter.to_dict() for fighter in fighters]
    
    print(f"Fighters List: {fighters_list}")  # Print the list after converting fighters to dictionaries

    return jsonify(fighters_list)

@fighter_routes.route('/api/fetch_fighter_characteristics/<nft_address>', methods=['GET'])
def fetch_fighter_data(nft_address):
    print(f"nft_address: {nft_address}")
    # Get the fighter from the database
    fighter = Fighter.query.filter_by(nft_address=nft_address).first()
    print(f"fighter: {fighter}")
    
    if fighter is not None:
        return jsonify(fighter.to_dict()), 200
    else:
        return jsonify({'error': 'Fighter not found'}), 404
# This endpoint uploads the characteristics of a new fighter it is used for the character generator component
@fighter_routes.route('/api/upload_fighter_characteristics/<dna>', methods=['POST'])
def upload_fighter_data(dna):
    # Get the data from the request
    data = request.get_json()

    # If no data is provided, return a 400 bad request status
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Extract the details of the fighter from the data
    name = data.get('name')
    group = data.get('group')
    image = data.get('image')
    nft_address = data.get('nft_address')
    game_characteristics = data.get('game_characteristics')

    # If any required detail is missing, return a 400 bad request status
    if not all([name, group, image, nft_address, game_characteristics]):
        return jsonify({"message": "Missing required fields"}), 400

    # Create the new fighter and add it to the database
    new_fighter = Fighter(
        name=name,
        group=group,
        image=image,
        dna=dna,
        nft_address=nft_address,
        game_characteristics=game_characteristics
    )
    db.session.add(new_fighter)
    db.session.commit()

    # Return a success message and the details of the new fighter
    return jsonify({"message": "Fighter created", "fighter": new_fighter.to_dict()}), 201

@fighter_routes.route('/api/upload_fighter_image/<dna>', methods=['POST'])
def upload_fighter_image(dna,baseUrl):
    data = request.get_json()

    # Get image data from the JSON payload
    image_data = data.get('imageData')

    # Remove 'data:image/png;base64,' from the start of the string
    image_data = image_data.split(',')[1]

    # Decode the base64 image data
    decoded_image_data = base64.b64decode(image_data)

    # Save the image
    image_path = os.path.join('static', 'sprites',  f'{dna}.png')
    with open(image_path, 'wb') as f:
        f.write(decoded_image_data)
    
        
    # Return a success message and the path of the image
    return jsonify({'status': 'success', 'message': 'Image uploaded successfully', 'imagePath': image_path})

@fighter_routes.route('/api/delete_fighter_characteristics/<dna>', methods=['POST'])
def del_fighter_data(dna):
    fighter = Fighter.query.filter_by(dna=dna).first()
    
    # If no fighter is found, return a 404 not found status
    if fighter:
        
        # If the fighter is found, delete it from the database
        db.session.delete(fighter)
        db.session.commit()
        # Return a success message
        return jsonify({"message": "Fighter characteristics deleted"}), 200
    else:
        return jsonify({"message": "No fighter found with this NFT address"}), 404

@fighter_routes.route('/api/delete_fighter_image/<dna>', methods=['POST'])
def del_fighter_image(dna):
    fighter = Fighter.query.filter_by(dna=dna).first()
    if fighter:
        # If the fighter is found, delete its image
        image_path = os.path.join('static', 'sprites',  f'{dna}.png')
        if os.path.isfile(image_path):
            os.remove(image_path)
            return jsonify({'status': 'success', 'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({"message": "No image found for this NFT address"}), 404
    else:
        # If no fighter is found, return a 404 not found status
        return jsonify({"message": "No fighter found with this NFT address"}), 404

@fighter_routes.route('/api/create_fighter', methods=['POST'])
def create_fighter():
    
    data = request.get_json()
    new_fighter = Fighter(
        name=data.get('name'),
        collection=data.get('collection'),
        image=data.get('image'),
        rank=data.get('rank'),
        nft_address=data.get('nft_address'),
        game_characteristics_json=data.get('game_characteristics_json'),
        handler=data.get('handler')
    )

    db.session.add(new_fighter)
    db.session.commit()

    return jsonify(new_fighter.to_dict()), 201

@fighter_routes.route('/update-fighter/<id>', methods=['PUT'])
def update_fighter(id):
    fighter = Fighter.query.get(id)
    if not fighter:
        return {"error": "Fighter not found"}, 404
    data = request.json
    fighter.name = data.get('name', fighter.name)
    fighter.power = data.get('power', fighter.power)
    db.session.commit()
    return jsonify(fighter.to_dict()), 200