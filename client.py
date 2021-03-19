import datetime
import json
import socket
import pyrebase

# configuration of the connexion to Firebase
config = {
    'apiKey': "AIzaSyBhWCedCUO7yVNDd-nhnAXatyq0V6GShic",
    'authDomain': "elderly-622a9.firebaseapp.com",
    'databaseURL': "https://elderly-622a9-default-rtdb.europe-west1.firebasedatabase.app",
    'projectId': "elderly-622a9",
    'storageBucket': "elderly-622a9.appspot.com",
    'messagingSenderId': "792971798543",
    'appId': "1:792971798543:web:2c5ffefb25ca6926131b7a",
    'measurementId': "G-GXN13DRQ8W"
}

# Create a Firebase objet initialized by our configuration JSON object
firebase = pyrebase.initialize_app(config)

# Get a reference to the database service
db = firebase.database()
#############################

HOST = '169.254.0.2'  # Host IP
PORT = 3000  # Host port
frequency = 30  # Sending frequency
i = 0

# Create a receiving socket stream
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# Connexion with the Raspberry Pi
s.connect((HOST, PORT))
while True:
    buf = s.recv(1024)  # Receiving the data from the Raspberry
    if len(buf) > 0:
        try:
            r = json.loads(buf.decode())  # Decode the buffer object
            accel = r['acceleration']
            gyro = r['gyroscope']
            # The counter i will increment until it reaches 30, then we will send the data to our real time database.
            # We do this to reduce the number of accesses to the database in order to have better performances
            i += 1
            if i == frequency:
                # Set current date and time
                r['date'] = datetime.datetime.now().isoformat()
                userId = r['userId']
                # push the data in our database
                db.child("users/"+userId+'/raspberry').push(r)
                i = 0
        except:
            pass
