from sense_hat import SenseHat
import socket
import json

# initialiser sense hat
sense = SenseHat()
# activer le gyroscope
sense.set_imu_config(True, True, False)
# configurer socket
HOST = '169.254.0.2' # IP de l'hote
PORT = 3000 # numero de port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# modifier les options de la socket, nodelay, flush after write
s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
print('Socket cree')

# gerer les exceptions des sockets
try:
    s.bind((HOST, PORT))
except socket.error:
    print('connexion echouée ')

s.listen(5)
print('Socket en attente')
(conn, addr) = s.accept()
print('Connection')

# init dict
donneesJson = {
    'acceleration_raw':{'x':0, 'y':0, 'z':0},
    'acceleration':{'roll':0, 'pitch':0, 'yaw':0},
    'gyroscope':{'roll':0, 'pitch':0, 'yaw':0},
}
stringDataOld = ''
roundWith = 2


while True:
# recuperer les donnees du gyroscope
    gyroscope = sense.get_orientation_degrees()
    donneesJson['gyroscope']['roll'] = round(gyroscope['roll'], roundWith)
    donneesJson['gyroscope']['pitch'] = round(gyroscope['pitch'], roundWith)
    donneesJson['gyroscope']['yaw'] = round(gyroscope['yaw'], roundWith)

    # envoi des donnees
    donnees = json.dumps(donneesJson)
    if donnees != anciensDonnees:
        try:
            conn.sendall(donnees.encode())
            f = conn.makefile(mode='w')
            f.flush()
        except:
            print("l'autre paire s'est deconnectée")
            (conn, addr) = s.accept()
            print('connecté')
    anciensDonnees = donnees

conn.close() # Close connections