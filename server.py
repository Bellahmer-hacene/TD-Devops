from sense_hat import SenseHat
import socket
import json
import os


# initialize sense hat
sense = SenseHat()
# gyroscope only
sense.set_imu_config(True, True, False)
# configure socket
HOST = '169.254.0.2' # Server IP or Hostname
PORT = 3000 # Pick an open Port (1000+ recommended), must match the client sport

response = os.system("ping -c 1 " + HOST) #ping pour savoir si le serveur disponible ou pas

assert response==0 #si in n'égale pas à 0 , donc on peut pas joindre le serveur

userId = 'Zp7JOtRA93P3R9zxncupVzqyOI53' # Elder Id
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# set options, nodelay, flush after write
s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
print('Socket created')

#managing error exception
try:
    s.bind((HOST, PORT))
except socket.error:
    print('Bind failed ')

s.listen(5)
print('Socket awaiting messages')
(conn, addr) = s.accept()
print('Connected')

# init dict
jsonData = {
    'acceleration_raw':{'x':0, 'y':0, 'z':0},
    'acceleration':{'roll':0, 'pitch':0, 'yaw':0},
    'gyroscope':{'roll':0, 'pitch':0, 'yaw':0},
    'pressure': 0,
    'temperature': 0,
    'humidity': 0,
    'stick': {'direction':'', 'action':''}
}
stringDataOld = ''
roundWith = 2

# awaiting for message
while True:
    # data = conn.recv(1024)
    # print('received : ' + str(data))
    # get acceleration raw
    acceleration_raw = sense.get_accelerometer_raw()
    assert acceleration_raw is not None # vérifier que le acceleration_raw n'est pas nulle
    jsonData['userId'] = userId
    jsonData['acceleration_raw']['x'] = round(acceleration_raw['x'], roundWith)
    jsonData['acceleration_raw']['y'] = round(acceleration_raw['y'], roundWith)
    jsonData['acceleration_raw']['z'] = round(acceleration_raw['z'], roundWith)
    # get rotation from acceleration
    acceleration = sense.get_accelerometer()
    assert acceleration is not None
    jsonData['acceleration']['roll'] = round(acceleration['roll'], roundWith)
    jsonData['acceleration']['pitch'] = round(acceleration['pitch'], roundWith)
    jsonData['acceleration']['yaw'] = round(acceleration['yaw'], roundWith)
    # get gyroscope data
    gyroscope = sense.get_orientation_degrees()
    assert gyroscope is not None
    jsonData['gyroscope']['roll'] = round(gyroscope['roll'], roundWith)
    jsonData['gyroscope']['pitch'] = round(gyroscope['pitch'], roundWith)
    jsonData['gyroscope']['yaw'] = round(gyroscope['yaw'], roundWith)
    jsonData['pressure'] = sense.get_pressure()
    jsonData['temperature'] = sense.get_temperature()
    jsonData['humidity'] = sense.get_humidity()

    events = sense.stick.get_events()
    assert events is not None
    if len(events)>0:
        for event in events:
            jsonData['stick']['direction'] = event.direction
            jsonData['stick']['action'] = event.action
    else:
        jsonData['stick']['direction'] = ''
        jsonData['stick']['action'] = ''

    # Sending reply
    data = json.dumps(jsonData)
    assert data is not None
    if data != stringDataOld:
        # print('sending :', data)
        try:
            conn.sendall(data.encode())
            f = conn.makefile(mode='w')
            f.flush()
        except:
            print('connection reset by peer, waiting for a client')
            (conn, addr) = s.accept()
            print('Connected')
    stringDataOld = data

conn.close() # Close connections