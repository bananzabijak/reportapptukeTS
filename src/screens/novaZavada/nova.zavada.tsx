import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {TextInput, List, Button, Title} from 'react-native-paper';
import {novaStyle} from './nova.style';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

export const NovaZavada = ({navigation, route}: any) => {
  const {UserUID, UserEmail} = route.params;
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  // const zavadyCollection = firestore().collection('Zavady');
  // const reference = storage().ref(
  //   'gs://reportapptukets.appspot.com/Zavady/Fotky',
  // );
  const [nazev, setNazev] = useState('');
  const [obsah, setObsah] = useState('');
  const [mistnost, setMistnost] = useState('');
  const [typZavady, setTypZavady] = useState('');

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const selectImage = () => {
    const options = {
      maxWidth: 300,
      maxHeight: 550,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else {
        const assets = response.assets;
        console.log(assets[0].uri);
        const source = {uri: assets[0].uri};
        console.log(source);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(uri).putFile(uploadUri);
    
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert('Zavada p??id??na!');
    setImage(null);
  };



  const uploadZavadu = () => {
    firestore()
      .collection('Zavady')
      .add({
        nazev: nazev,
        popis: obsah,
        typ: typZavady,
        mistnost: mistnost,
        user: UserUID,
        image: image,
        stav: "Nov??",        
      })
      .then(async () => {
        console.log('Zavada p??id??na');
        await uploadImage();
        onPressNav();
      });
  };

  const onPressNav = () => {
    navigation.navigate('Vsechny zavady', {
      UserUID: UserUID,
      UserEmail: UserEmail,
    });
  };

  return (
    <View>
      <SafeAreaView>
        <ScrollView>
        <View style={novaStyle.zahlavi}> 
          <Title style={novaStyle.nadpis}>Nov?? z??vada</Title>
          </View>
          <View style={novaStyle.content}>
            <TextInput
              label="N??zev Z??vady"
              onChangeText={newNazev => setNazev(newNazev)}
              maxLength={20}
              defaultValue={nazev}></TextInput>
            <List.AccordionGroup>
              <List.Accordion
                title="Typ Z??vady"
                expanded={expanded}
                onPress={handlePress}
                id="1">
                <List.Item
                  title="Sv??tla"
                  onPress={() => {
                    setTypZavady('Sv??tla');
                  }}
                />
                <List.Item
                  title="??idle"
                  onPress={() => {
                    setTypZavady('??idle');
                  }}
                />
              </List.Accordion>
              <List.Accordion
                title="M??stnost"
                expanded={expanded}
                onPress={handlePress}
                id="2">
                <List.Item
                  title="N902"
                  onPress={() => {
                    setMistnost('N902');
                  }}
                />
                <List.Item
                  title="Posluch??rna 1"
                  onPress={() => {
                    setMistnost('Posluch??rna');
                  }}
                />
              </List.Accordion>
            </List.AccordionGroup>

            <TextInput
              multiline
              numberOfLines={4}
              style={novaStyle.popis}
              placeholder="Stru??n?? popi??t?? z??vadu"
              maxLength={400}
              onChangeText={newObsah => setObsah(newObsah)}
              defaultValue={obsah}></TextInput>
          </View>
          <View style={novaStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: image.uri}} style={novaStyle.imageBox} />
            ) : null}
            {uploading ? (
              <View style={novaStyle.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : null}
          </View>

          <View>
            <Button style={novaStyle.tlacitko} icon="camera" mode="contained" onPress={selectImage}>
              Vybrat obr??zek
            </Button>
            <Button style={novaStyle.tlacitko} icon="arrow-right" mode="contained" onPress={uploadZavadu}>
              Nahl??sit z??vadu
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
