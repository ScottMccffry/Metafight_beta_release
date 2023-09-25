from werkzeug.security import generate_password_hash
from flask import request, session, Flask
from app import app, db
from app.models import User

app = Flask(__name__)
app.config['VISITS'] = 0

#Admin - Fetch All Users:
@app.route('/admin/users', methods=['GET'])
def admin_get_users():
    # TODO: Ensure the logged in user is an admin
    users = User.query.all()
    users_list = [{"id": user.id, "username": user.username} for user in users]
    return {"users": users_list}

# Admin - Update User Information:
@app.route('/admin/users/<int:user_id>', methods=['PUT'])
def admin_update_user(user_id):
    # TODO: Ensure the logged in user is an admin
    data = request.get_json()
    user = User.query.get(user_id)

    if 'username' in data:
        user.username = data['username']
    if 'password' in data:
        user.password = generate_password_hash(data['password'], method='sha256')

    db.session.commit()
    return {"message": "User updated"}

#Admin - Delete User
@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    # TODO: Ensure the logged in user is an admin
    user = User.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted"}

@app.before_request
def increment_visit_count():
    app.config['VISITS'] += 1
    
@app.route('/visits', methods=['GET'])
def get_visit_count():
    return {"visits": app.config['VISITS']}
