import React from "react";
import "../App.css";
import firebase from "firebase";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import { IconButton } from "@material-ui/core";
import ThemeConfig from "../Constantes/Theme";
import { auth } from "..";
import { isLoggedIn } from "../Helpers/Auth";
var assert = require("assert");

if (window.DeviceOrientationEvent) {
  console.log("DeviceOrientation is supported");
} else if (window.OrientationEvent) {
  console.log("MozOrientation is supported");
}
if (window.DeviceMotionEvent) {
  console.log("DeviceMotionEvent is supported");
}

let k;
let lastInsert = new Date();
let frequency = 100;
// let data = []

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { recording: false, uid: isLoggedIn()?.uid };
  }
  startAccel = () => {
    if (this.state.recording === false) {
      this.setState({ recording: true }, () => {
        window.ondeviceorientation = null;
        window.addEventListener("deviceorientation", this.handleOrientation);
      });
    } else {
      this.setState({ recording: false });
    }
  };
  handleOrientation = (e) => {
    if (this.state.recording) {
      window.ondevicemotion = null;
      window.addEventListener("devicemotion", (v) =>
        this.handleMotion(v, {
          gyro: { alpha: e.alpha, beta: e.beta, gamma: e.gamma },
          date: new Date().toISOString(),
        })
      );
    }
  };
  handleMotion = (e, obj) => {
    try {
      if (this.state.recording) {
        if (new Date() - lastInsert > frequency) {
          k = firebase
            .database()
            .ref("users/" + this.state.uid + "/")
            .push().key;

          assert(e != null, "l'evénement est null");
          assert(0 <= e.acceleration <= 1, "Plage de valeurs violé ");
          assert(
            0 <= e.accelerationIncludingGravity <= 1,
            "Plage de valeurs violé "
          );
          assert(0 <= e.rotationRate <= 1, "Plage de valeurs violé ");
          firebase
            .database()
            .ref("users/" + this.state.uid + "/data/" + k)
            .set({
              accel: {
                acceleration: e.acceleration,
                accelerationIncludingGravity: e.accelerationIncludingGravity,
                rotationRate: e.rotationRate,
              },
              ...obj,
            });
          lastInsert = new Date();
          // update steps
          var res = Math.sqrt(
            Math.pow(obj.gyro?.alpha, 2),
            Math.pow(obj.gyro?.beta, 2),
            Math.pow(obj.gyro?.gamma, 2)
          );
          if (res > 200 && lastInsert) {
            var dd = new Date().toLocaleDateString().replace(/\//g, "-");
            firebase
              .database()
              .ref("users/" + this.state.uid + "/profile/steps/" + dd)
              .once("value", (snapshot) => {
                var steps = snapshot.val()?.steps || 0;
                firebase
                  .database()
                  .ref("users/" + this.state.uid + "/profile/steps/" + dd)
                  .update({ steps: steps + 1 });
              });
          }
        }
      }
    } catch (e) {
      console.log("Erreur", e);
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header" style={{ backgroundColor: "white" }}>
          {/* <Button
                        style={{ backgroundColor: this.state.recording ? ThemeConfig.danger : ThemeConfig.success, height: '20vh', width:'20vh', borderRadius: '50%', fontWeight: 'bolder', fontSize:'30px', color:'white' }}
                        variant="contained"
                        size="small"
                        startIcon={this.state.recording ? <Pause style={{ fontSize: 40 }} /> : <PlayArrow style={{ fontSize: 40 }} />}
                        onClick={this.startAccel}
                    >
                        {this.state.recording ? 'Stop' : 'Start'}
                    </Button> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={this.startAccel}
              style={{
                backgroundColor: this.state.recording
                  ? ThemeConfig.danger
                  : ThemeConfig.success,
                color: "white",
              }}
            >
              {this.state.recording ? (
                <Pause style={{ fontSize: 40 }} />
              ) : (
                <PlayArrow style={{ fontSize: 40 }} />
              )}
            </IconButton>
          </div>
        </header>
      </div>
    );
  }
}

export default Home;
