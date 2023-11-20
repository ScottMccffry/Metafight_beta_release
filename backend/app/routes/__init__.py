from .marketplace import marketplace_routes
from .general import general_routes
from .fighter import fighter_routes
from .fight import fight_routes
from .transaction import transaction_routes
from .user import user_routes
from .bets import bets_routes
from .bids import bid_routes
from .collection import collection_routes
from .pending  import pending_routes
from .websocket import socketio  # Import socketio object from websocket.py
from .pending import pending_routes
def register_routes(app):
    app.register_blueprint(marketplace_routes)
    app.register_blueprint(general_routes)
    app.register_blueprint(fighter_routes)
    app.register_blueprint(fight_routes)
    app.register_blueprint(transaction_routes)
    app.register_blueprint(user_routes)
    app.register_blueprint(bets_routes)
    app.register_blueprint(bid_routes)
    app.register_blueprint(collection_routes)
    app.register_blueprint(pending_routes)
 

# Socket.io requires a slightly different setup than standard Flask routes

def register_socketio(app):
    socketio.init_app(app, cors_allowed_origins="*")
