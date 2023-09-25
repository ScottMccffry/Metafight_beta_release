from flask import Flask
from .routes import register_routes, register_socketio


from .database import db
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__, static_url_path='/static', static_folder='../static')
    app.secret_key = 'secretKey'
    #app.secret_key = os.environ.get('SECRET_KEY')


    app.config.from_object(config_class)

    db.init_app(app)
    register_routes(app)
    register_socketio(app)

    # Create the Migrate instance here, after the app is created

    return app
