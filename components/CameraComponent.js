import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import Image from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedImage";
import { useNavigation } from "@react-navigation/native";
import styles from "../components/styles/Style";

function CameraScreen() {
  const navigation = useNavigation();

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === "granted");
      } catch (e) {
        console.log(`Camera: ${e}`);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
      };
      const data = await camera.takePictureAsync(options);
      setImage(data.uri);
      setImageData(data);
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const uploadPicture = async () => {
    const authToken = await AsyncStorage.getItem("@session_token");
    const userId = await AsyncStorage.getItem("@user_id");
    const res = await fetch(imageData.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
      method: "post",
      headers: {
        "Content-Type": "image/jpeg",
        "X-Authorization": authToken,
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate("Profile", { profileId: userId });
        } else if (response.status === 401) {
          console.log("Could not upload photo");
        } else {
          throw "Something went wrong";
        }
      })
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.camera}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio="1:1"
        />
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.buttonText}>Flip Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture()} style={styles.button}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <View style={styles.container}>
          <Image source={{ uri: image }} style={{ flex: 1 }} />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => uploadPicture()}
            >
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CameraScreen;
