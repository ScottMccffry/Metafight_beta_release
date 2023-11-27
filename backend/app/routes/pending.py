from flask import request, jsonify, Blueprint
from app.models import Pending
from app.database import db
from sqlalchemy.exc import SQLAlchemyError
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import json
import requests
import base64
import os


scheduler = BackgroundScheduler()

pending_routes = Blueprint('pending_routes', __name__)

@pending_routes.route('/api/mint_request/', methods=['POST'])
def receive_mint_request():
    if not request.json:
            print("No JSON data received in request")
            return jsonify({'error': 'No data provided'}), 400

    data = request.json.get('data')
    if data is None:
            print("No 'data' field in JSON request")
            return jsonify({'error': 'Missing data field in request'}), 400

    print("Received data:", data)
    
    new_mint = Pending(
        nft_address= data.get('owner_nft_address'),
        data_to_validate=data,
        request_type=1,
        status='pending'
        )
    db.session.add(new_mint)
    print("ok1")
    try:
        db.session.commit()
        print(f"Scheduling rollback job for mint ID: {new_mint.id}")
         # Schedule the rollback function to run after 10 minutes if not confirmed
        print("ok2")
        scheduler.add_job(
            func=Pending.rollback_mint,  # Reference to the rollback_mint method
            trigger='date',
            run_date=datetime.now() + timedelta(minutes=10),
            args=[new_mint.id],  # Passing the new_mint id as an argument
            id=f'rollback_mint_{new_mint.id}'  # Unique ID for the job
        )
        print("ok3")

        return jsonify({'status': 'pending', 'id': new_mint.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database Error: {e}")  # Print the error to the console for debugging
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pending_routes.route('/api/upload_metadata_to_ipfs/', methods=['POST'])
def upload_metadata_to_ipfs():
    try:
        metadata = request.json.get('data')
        # Convert JSON metadata to bytes
        metadata_bytes = metadata.encode('utf-8')

        response = requests.post(
            'https://ipfs.infura.io:5001/api/v0/add',
            files={'file': ('metadata.json', metadata_bytes)},  # Pass metadata as file
            auth=(os.environ['INFURA_PROJECT_ID'], os.environ['INFURA_PROJECT_SECRET'])
        )

        if response.status_code != 200:
            raise Exception('Failed to upload to IPFS: ' + response.text)

        res = response.json()
        return jsonify({'ipfsHash': res['Hash']}), 200

    except Exception as e:
        print(f"IPFS Upload Error: {e}")
        return jsonify({'error': 'Failed to upload metadata to IPFS'}), 500

@pending_routes.route('/api/upload_image_to_ipfs/', methods=['POST'])  
def upload_image_to_ipfs():
    try:
        image_data = request.json.get('imageData')
        if not image_data.startswith('data:image/png;base64,'):
            raise ValueError("Invalid image data")
        image_bytes = base64.b64decode(image_data.split(',')[1])

        response = requests.post(
            'https://ipfs.infura.io:5001/api/v0/add',
            files={'file': image_bytes},
            auth=(os.environ['INFURA_PROJECT_ID'], os.environ['INFURA_PROJECT_SECRET'])
        )

        if response.status_code != 200:
            raise Exception('Failed to upload to IPFS')

        res = response.json()
        return jsonify({'ipfsHash': res['Hash']}), 200

    except Exception as e:
        print(f"IPFS Upload Error: {e}")
        return jsonify({'error': 'Failed to upload image to IPFS'}), 500



"""
problem parce que je n'upload pas vraiment a la db fighter
"""
@pending_routes.route('/api/mint_confirm/', methods=['POST'])

def confirm_mint():
    data = request.json
    print("Received data:", data)  # Log incoming request data

    owner = data.get('owner')
    pending_id = data.get('pending_id')
    status = 'Approved'
   
    print(f"Looking for pending mint with owner: {owner} and pending ID: {pending_id}")
    pending_mint = Pending.query.filter_by(nft_address=owner, id=pending_id).first()#potentiellement dangereux aue je n'identifie que le owner et le pending Id plutot aue le nftAddress du NFT, mais plus compliqué car je ne la connais pas avant de mint , enfait impossible

    if pending_mint:
        try:
            print(f"Pending mint found. Updating status to {status}")
            pending_mint.status = status
            db.session.commit()
            print("Commit successful")

            # Remove the scheduled rollback job if it exists
            job_id = f'rollback_mint_{pending_id}'
            if scheduler.get_job(job_id):
                print(f"Removing scheduled rollback job: {job_id}")
                scheduler.remove_job(job_id)

            return jsonify({'status': status}), 200
        except SQLAlchemyError as e:
            print(f"Database Error: {e}")
            db.session.rollback()
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        print("No pending mint found for the given owner and ID")
        return jsonify({'status': 'error', 'message': 'Mint ID not found'}), 404

# Flask route to handle the staking request
@pending_routes.route('/api/stake_request/', methods=['POST'])
def handle_stake_request():
    nft_address = request.json.get('nft_address')
    # Create a new pending staking record in the database
    new_stake = Pending(nft_address=nft_address, status='pending')  # Use nft_address instead of nft_id
    db.session.add(new_stake)
    try:
        db.session.commit()
        # Schedule the rollback function to run after 10 minutes if not confirmed
        scheduler.add_job(
            func=db.session.rollback_stake,  # Ensure this function is defined
            trigger='date',
            run_date=datetime.now() + timedelta(minutes=10),
            args=[new_stake.id],
            id=f'rollback_stake_{new_stake.id}'  # Unique ID for the job
        )
        return jsonify({'status': 'pending', 'id': new_stake.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Confirm staking route
@pending_routes.route('/stake_confirm/', methods=['POST'])
def confirm_stake():
    data = request.json
    stake_id = data.get('stake_id')
    status = data.get('status')  # 'confirmed' or 'failed'

    pending_stake = Pending.query.get(stake_id)
    if pending_stake:
        try:
            pending_stake.status = status
            db.session.commit()
            # Remove the scheduled rollback job if it exists
            job_id = f'rollback_stake_{stake_id}'
            if scheduler.get_job(job_id):
                scheduler.remove_job(job_id)
            return jsonify({'status': status}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        return jsonify({'status': 'error', 'message': 'Stake ID not found'}), 404
    