from flask import request, jsonify, Blueprint
from app.models import Pending
from app.database import db
from sqlalchemy.exc import SQLAlchemyError
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import json
import ipfshttpclient
import base64
import os
INFURA_PROJECT_ID = os.getenv('INFURA_PROJECT_ID')
INFURA_PROJECT_SECRET = os.getenv('INFURA_PROJECT_SECRET')

scheduler = BackgroundScheduler()

pending_routes = Blueprint('pending_routes', __name__)

@pending_routes.route('/api/mint_request/', methods=['POST'])
def receive_mint_request():
    data_json = request.json.get('data')
    data = json.loads(data_json)
    
    new_mint = Pending(
        nft_address= data.get('owner_nft_address'),
        data_to_validate=data,
        request_type=1,
        status='pending'
        )
    db.session.add(new_mint)
    try:
        db.session.commit()
         # Schedule the rollback function to run after 10 minutes if not confirmed
        scheduler.add_job(
            func=Pending.rollback_mint,  # Reference to the rollback_mint method
            trigger='date',
            run_date=datetime.now() + timedelta(minutes=10),
            args=[new_mint.id],  # Passing the new_mint id as an argument
            id=f'rollback_mint_{new_mint.id}'  # Unique ID for the job
        )

        return jsonify({'status': 'pending', 'id': new_mint.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@pending_routes.route('/api/upload_to_ipfs/', methods=['POST'])
def upload_to_ipfs():
    try:
        image_data = request.json.get('imageData')
        image_bytes = base64.b64decode(image_data.split(',')[1])
        print(f"decode ok")
        print(f"{INFURA_PROJECT_ID}")
        print(f"{INFURA_PROJECT_SECRET}")

        client = ipfshttpclient.connect(
            '/dns/ipfs.infura.io/tcp/5001/https',
            auth=(os.environ[INFURA_PROJECT_ID], os.environ[INFURA_PROJECT_SECRET])
        )
        print(f"IPFS upload ok")
        res = client.add_bytes(image_bytes)
        

        return jsonify({'ipfsHash': res['Hash']}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to upload image to IPFS'}), 500

@pending_routes.route('/api/mint_confirm/', methods=['POST'])
def confirm_mint():
    data = request.json
    owner = data.get('owner')
    pending_id= data.get('oending_id')
    status = 'Approved'  
    
    pending_mint = Pending.query.filter_by(nft_address=owner, id=pending_id).first()
    if pending_mint:
        try:
            pending_mint.status = status
            db.session.commit()
            #not sure about the commit here above, I think it should be delete
            # Remove the scheduled rollback job if it exists
            job_id = f'rollback_mint_{pending_id}'
            if scheduler.get_job(job_id):
                scheduler.remove_job(job_id)
            return jsonify({'status': status}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
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
    