import datetime
import json
import socket
import pyrebase
import os

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
assert type(firebase) is pyrebase.pyrebase.Firebase , 'L\'objet retourné n\'ai pas de type Firebase'
# Get a reference to the database service
db = firebase.database()
assert type(db) is pyrebase.pyrebase.Database , 'L\'objet retourné n\'ai pas de type Database'

#############################
HOST = '169.254.0.2'  # Host IP
PORT = 3000  # Host port
frequency = 30  # Sending frequency
i = 0

response = os.system("ping -c 1 " + HOST)

assert response == 0 # si l'assertio est violé , ca veut dire que la connexion n'est pas établie

# Create a receiving socket stream
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# Connexion with the Raspberry Pi
s.connect((HOST, PORT))
while True:
    buf = s.recv(1024)  # Receiving the data from the Raspberry
    if len(buf) > 0:
        try:
            r = json.loads(buf.decode())  # Decode the buffer object
            assert type(r) is dict , 'Erreur lors du parse du buffer reçu vers JSON'
            assert r is not None # pas de valeur null pour le dictionnaire
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
        except e:
            print("Erreur", e)