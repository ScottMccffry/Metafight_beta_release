from flask_cors import CORS
from app import create_app, db
from flask_limiter import Limiter
from apscheduler.schedulers.background import BackgroundScheduler
from multiprocessing import Process
#from app import eventListener  # This is your event listener module
#from websocket import socketio
from app.routes.websocket import socketio  # Import the SocketIO instance



scheduler = BackgroundScheduler()




app = create_app()
limiter = Limiter(app)
CORS(app)

if __name__ == '__main__':
    # Start the event listener in a separate process
    #Process(target=eventListener.main).start()
    #before it was app.run(debug=True)
<<<<<<< HEAD
    scheduler.start()
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
=======
    socketio.run(app, host="0.0.0.0",port=5000, debug=False)
>>>>>>> f558dea (aws)
