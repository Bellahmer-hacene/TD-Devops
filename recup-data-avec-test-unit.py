import socket
import json
import math

HOST = '169.254.0.2'  # IP de la hote
PORT = 3000  # numero de port

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
while True:
    buf = s.recv(1024)
    if len(buf) > 0:
        try:
            r = json.loads(buf.decode())
            # récuperer les valeurs du gyroscope
            gyro = r['gyroscope']
            print(gyro)
            # vérifier les valeurs de l'axe roll afin de detecter si la fenetre est ouverte ou fermée
            # assertion pour verifier la valeur du gyroscope
            assert gyro >= 0, 'la valeur du gyroscope doit etre positive'
            if (gyro['roll'] <= 200 and gyro['roll'] >= 0):
                print(" Window closed")
            else:
                print("Window opened")

        except:
            pass

