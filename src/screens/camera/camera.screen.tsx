import React from "react";
import { SafeAreaView, View } from "react-native";
import { RNCamera } from "react-native-camera";
import { useCamera } from "react-native-camera-hooks";
import { cameraStyle } from "./camera.style";
import { Button } from "react-native-paper";
import { HeaderComponent } from "../../components/header/header.component";
import RNFS from 'react-native-fs';
//Nechápu proč dostávám child error když chci vykreslit tento komponent


export const CameraScreen = ({navigation, route}) => {

    

    const [{ cameraRef }, { takePicture }] = useCamera();//zde by v useCamera melo být ještě null, ale vyhazuje mi error
    const capturePic = async () => {

        try {
            const data = await takePicture();
            console.log(data.uri);
            const filePath = data.uri;
            const newFilePath = RNFS.ExternalCachesDirectoryPath + '/FotoZavady.jpg';
            RNFS.moveFile(filePath, newFilePath)
                .then(() => {

                    console.log('IMAGE MOVED', filePath, 'to', newFilePath);
                })
                .catch(error => {
                    console.log(error);
                })
        }

        catch (error) {

            console.log(error);
        }

    }



    return (
        <View style={cameraStyle.body}>
        
            <HeaderComponent title="Camera" />
            <RNCamera
                ref={cameraRef}
                type={RNCamera.Constants.Type.back} style={cameraStyle.preview}
                >

                <Button icon="camera" mode="contained" onPress={() => capturePic()}>
                    Press me
                </Button>

            </RNCamera>
        
        </View>

    );
}
