
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Clipboard,
  View,
  Switch,
  TouchableOpacity,
  Image,
} from "react-native";
import { Constants, Camera, Permissions, FileSystem, ImageManipulator} from "expo";
/*import { RNCamera } from 'react-native-camera';
import { ImagePicker } from 'react-native-image-picker';
//import { Permissions } from 'react-native-permissions';*/
//import Canvas from 'react-native-canvas';

var fr;
var results;
var photo;
var data;
var reader;
var res;
var restring;
export default class App extends Component {
  state = {
    switchValue: true,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imageuri: "",
    url: ""
  };

  

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }



  cameraChange = () => {
    this.setState({
      imageuri: "",
      url: "",
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
    //console.log("Hello")
  };

  //This function creates a picture using the phone's camera
  snap = async() => {
    if (this.camera) {
      photo = await this.camera.takePictureAsync({quality: 1.0, });
      if (photo) {
        this.setState({ imageuri: photo.uri });
        var image = photo;
        //console.log(photo.height, photo.width);
      }
    }
  };


  upload = async() => {
    const file = {
      uri: this.state.imageuri,
      name: `img.jpeg`,
      type: "image/jpeg"

    };

    



    image = await ImageManipulator.manipulateAsync(file.uri,[{resize: {width: 64, height: 64}}],{format: 'png'});
    this.setState({photouri: image.uri});
    console.log(image.height, image.width);
    console.log(image.uri);

    const pngfile ={
      uri: this.state.photouri,
      name: `name.png`,
      type: "image/png"

    };


    var xml = new XMLHttpRequest();
    xml.open("GET", this.state.photouri, true);
    xml.responseType = "blob";
    xml.onload = function(e) {
      //console.log(this.response);
      var reader = new FileReader();
      reader.onload = function(event) {
        res = event.target.result;
        b64 = JSON.stringify(res);
        console.log(res.size);


      }
      var imageres = this.response;
      var data = reader.readAsDataURL(imageres);
      return res;
    };
    xml.send();
    //console.log(xml);
    //console.log(typeof res);


    var request = new XMLHttpRequest();
    var fd = new FormData();
    var form = new FormData();
    //console.log(res);

    var blob = new Blob([JSON.stringify(res)],'text/json');

    request.open('POST','https://webhook.site/e5810097-bee7-41c8-8a32-37cdf2655e09', true);
    //request.open('Post', file.uri, true);

    request.setRequestHeader("Content-type", 'application/json');
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var imageName = request.responseText;

      }
    }
    fd.append('body',blob);
    fd.append('myFile', JSON.stringify(restring));
    request.send(blob);
    //request.send();

    /*fetch('https://webhook.site/e5810097-bee7-41c8-8a32-37cdf2655e09', {
      method: 'POST',
      body: blob,
      headers:{
        'Content-Type': 'multipart/form'
      }
    })*/


  }
  


  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.switchview}>
            <Text>Show camera</Text>
            <Switch
              onValueChange={value => {
                this.setState({ switchValue: value });
              }}
              value={this.state.switchValue}
              style={styles.switch}
            />
          </View>
          {this.state.switchValue ? (
            <View style={styles.cameraview}>
              {this.state.imageuri != "" ? (
                <Image
                  source={{
                    uri: this.state.imageuri
                  }}
                  style={styles.uploadedImage}
                  resizeMode="contain"
                />
              ) : (
                <Camera
                  style={styles.camera}
                  type={this.state.type}
                  ref={ref => {
                    this.camera = ref;
                  }}
                >
                  <View style={styles.camerabuttonview}>
                    <TouchableOpacity
                      style={styles.cameraButtons}
                      onPress={this.cameraChange}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          marginBottom: 10,
                          color: "white"
                        }}
                      >
                        Flip
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              )}
            </View>
          ) : (
            <View style={styles.cameraview}>
              {this.state.url != "" ? (
                <Text>Uploaded url : {this.state.url}</Text>
              ) : null}
              <Text>Camera off</Text>
            </View>
          )}
          {this.state.switchValue ? (
            <View style={styles.buttonsView}>
              {this.state.imageuri == "" ? (
                <View style={styles.captureButtonView}>
                  <TouchableOpacity
                    style={styles.cameraButtons}
                    onPress={this.snap}
                  >
                    <Text
                      style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                    >
                      Capture
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <View style={styles.captureButtonView}>
                <TouchableOpacity
                  style={styles.cameraButtons}
                  onPress={this.upload}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                  >
                    Upload
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1dd1a1",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  switchview: {
    marginTop: 50,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5
  },
  switch: {
    padding: 5
  },
  cameraview: {
    height: 400,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    height: "95%",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  camerabuttonview: {
    height: "100%",
    backgroundColor: "transparent"
  },
  cameraButtons: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    margin: 5
  },
  captureButtonView: {
    height: 200
  },
  buttonsView: {
    height: 200,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  uploadedImage: {
    height: "90%",
    width: "90%",
    padding: 10
  }
});