import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, session, jsonify, Blueprint
from app.database import db
from app.models import Users,Transactions

user_routes = Blueprint('user_routes', __name__)


#User Registration
@user_routes.route('/api/user/register', methods=['POST'])
def register():
    data = request.get_json()
    password_hash = generate_password_hash(data['password'], method='sha256')
    user = Users(
        username=data['username'], 
        walletAddress=data['walletAddress'],
        email=data.get('email'),  # Use .get() to return None if the key is not in the dictionary
        password_hash=password_hash,
        image=data.get('image')  # Use .get() to return None if the key is not in the dictionary
    )
    db.session.add(user)
    db.session.commit()
    return {"message": "User registered successfully"}, 201
#User Logout
@user_routes.route('/api/user/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return {"message": "Logout successful"}


#User profile information fetch
@user_routes.route('/api/user/<wallet_address>', methods=['GET'])
def get_user_from_address(wallet_address):
    user = Users.query.filter_by(walletAddress=wallet_address).first()
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify(user.to_dict())

#specific user data through id
@user_routes.route('/api/user/<userId>', methods=['GET'])
def get_user_from_ID(userId):
    print(f"userId: {userId}")
    user = Users.query.filter_by(id=userId).first()
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify(user.to_dict())
    
#Update User Profile:
@user_routes.route('/api/user/update_profile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    user_id = session.get('user_id')

    if not user_id:
        return {"message": "Not logged in"}, 401

    user = Users.query.get(user_id)

    if 'username' in data:
        Users.username = data['username']
    if 'password' in data:
        Users.password = generate_password_hash(data['password'], method='sha256')

    db.session.commit()
    return {"message": "Profile updated"}

#Fetch All Transactions for a User:
@user_routes.route('/api/user/transactions', methods=['GET'])
def get_transactions():
    user_id = session.get('user_id')

    if not user_id:
        return {"message": "Not logged in"}, 401

    transactions = Transactions.query.filter_by(user_id=user_id).all()
    transactions_list = [{"id": tx.id, "amount": tx.amount} for tx in transactions]
    return {"transactions": transactions_list}

#Password reset
# This is a simple password reset. A more secure way would be to generate a password reset token and send it to the user's email.
@user_routes.route('/api/user/password_reset', methods=['POST'])
def password_reset():
    data = request.get_json()
    user = Users.query.filter_by(email=data['email']).first()
    if user:
        Users.password = generate_password_hash(data['password'], method='sha256')
        db.session.commit()
        return {"message": "Password reset successful"}, 200
    else:
        return {"message": "User not found"}, 404

#Update Email
@user_routes.route('/api/user/update_email', methods=['PUT'])
def update_email():
    data = request.get_json()
    user_id = session.get('user_id')

    if not user_id:
        return {"message": "Not logged in"}, 401

    user = Users.query.get(user_id)
    if user:
        Users.email = data['email']
        db.session.commit()
        return {"message": "Email updated successfully"}, 200
    else:
        return {"message": "User not found"}, 404
    
# This could be implemented in the login function like this
@user_routes.route('/api/user/login', methods=['POST'])
def login():
    # Check if request has JSON data
    if not request.is_json:
        print("No JSON data received in the request.")
        return {"message": "Bad Request, JSON data expected"}, 400
    
    data = request.get_json()
    print(f"Received data: {data}")

    # Check for email and password in data
    if 'email' not in data or 'password' not in data:
        print("Email or password not provided.")
        return {"message": "Email and password must be provided"}, 400

    user = Users.query.filter_by(email=data['email']).first()
    print(f"User query result: {user}")

    if user and user.verify_password(data['password']):
        session['user_id'] = user.id
        #user.last_login = datetime.utcnow()
        db.session.commit()
        print(f"User {user.email} logged in.")
        print(user.__dict__)
        return {"userId": user.id, "userAddress": user.walletAddress, "message": "Login successful"}, 200
    else:
        print("Invalid username or password.")
        return {"message": "Invalid username or password"}, 401


#Record a user transaction
@user_routes.route('/api/user/create_transactions', methods=['POST'])
def create_transaction():
    data = request.get_json()
    user_id = session.get('user_id')

    if not user_id:
        return {"message": "Not logged in"}, 401

    transaction = Transactions(user_id=user_id, amount=data['amount'])
    db.session.add(transaction)
    db.session.commit()
    return {"message": "Transaction recorded"}, 201

#login required il faut ajuster
@user_routes.route('/api/user/delete-account', methods=['DELETE'])
#@login_required
def delete_account():
    db.session.delete(current_user)
    db.session.commit()
    return {"message": "Account deleted successfully"}, 200