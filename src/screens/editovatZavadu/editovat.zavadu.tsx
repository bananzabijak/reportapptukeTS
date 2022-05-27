import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {TextInput, List, Button, Title} from 'react-native-paper';
import {editovatStyle} from './editovat.style';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

export const EditovatZavadu = ({navigation, route}) => {
  const [expanded, setExpanded] = React.useState(true);

  const {ZavadaID, UserUID, UserEmail, ImageUrl, DefaultImage} = route.params;

  const handlePress = () => setExpanded(!expanded);

  const zavadyCollection = firestore().collection('Zavady');
  
  const [nazev, setNazev] = useState('');
  const [obsah, setObsah] = useState('');
  const [mistnost, setMistnost] = useState('');
  const [typZavady, setTypZavady] = useState('');

  const returnToVsechyZavady = () => {
    navigation.navigate('Vsechny zavady', {
      UserUID: UserUID,
      UserEmail: UserEmail,      
    });
  };

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
    Alert.alert('Zavada editována!');
    setImage(null);
  };

  const getZavada = async () => {
    const editovanaZavada = await firestore()
      .collection('Zavady')
      .doc(ZavadaID)
      .get()
      .then(documentSnapshot => {
        const dataZavady = documentSnapshot.data();
        console.log('data', dataZavady);
        
        setMistnost(dataZavady?.mistnost);
        setTypZavady(dataZavady?.typ);
        setObsah(dataZavady?.popis);
        setNazev(dataZavady?.nazev);
        setImage(dataZavady?.image);
        
      });

    
  };

  useEffect(() => {
    getZavada();    
    return () => {
      setMistnost('');
      setTypZavady('');
      setObsah('');
      setNazev('');  
      setImage(null); 
      
    };
   
  }, []);
 

  const editZavadu = () => {
    if (nazev.length == 0) {
      Alert.alert('Zadajte názov závady!');
    } else if (obsah.length == 0) {
      Alert.alert('Vyplnte obsah závady!');
    } else if (typZavady.length == 0) {
      Alert.alert('Zvolte typ závady');
    } else if (mistnost.length == 0) {
      Alert.alert('Zvolte miestnost závady');
    } else if (image == null) {
      Alert.alert('Zvolte fotku závady');
    } else {
    firestore()
      .collection('Zavady')
      .doc(ZavadaID)
      .update({
        nazev: nazev,
        popis: obsah,
        typ: typZavady,
        mistnost: mistnost,
        user: UserUID,
        image: image,
        stav: "Upravené",        
      })
      .then(async () => {
        console.log('Závada upravená');       
        await uploadImage();
        returnToVsechyZavady();
      
        
      });}
  };
 

  return (
    <SafeAreaView>
      <ScrollView>
      <View style={editovatStyle.zahlavi}> 
          <Title style={editovatStyle.nadpis}>Upraviť závadu</Title>
          </View>
        <View style={editovatStyle.content}>
          <TextInput
            style={editovatStyle.nazev}
            label="Názov"
            maxLength={20}
            onChangeText={newNazev => setNazev(newNazev)}
            value={nazev}></TextInput>
          <List.AccordionGroup>
            <List.Accordion
              title="Typ Závady"
              expanded={expanded}
              onPress={handlePress}
              id="1">
              <List.Item
                style={editovatStyle.listItem}
                title="Svetla"
                onPress={() => {
                  setTypZavady('Svetla');
                }}
              />
              <List.Item
                title="Stoličky"
                onPress={() => {
                  setTypZavady('Stoličky');
                }}
              />
            </List.Accordion>
            <List.Accordion
              title="Miestnosť"
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
                title="Poslucháreň 1"
                onPress={() => {
                  setMistnost('Poslucháreň 1');
                }}
              />
            </List.Accordion>
          </List.AccordionGroup>

          <TextInput
            multiline
            numberOfLines={4}
            style={editovatStyle.popis}
            placeholder="
            Stručne popíšte závadu
            "
            maxLength={400}
            onChangeText={newObsah => setObsah(newObsah)}
            value={obsah}></TextInput>

          <View style={editovatStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: ImageUrl}} style={editovatStyle.imageBox} />
            ) : null}
            {uploading ? (
              <View style={editovatStyle.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : null}
          </View>
          <Button icon="camera" style={editovatStyle.tlacitko} mode="contained" onPress={selectImage}>
            Vybrať obrázok
          </Button>
          <Button icon="arrow-right" style={editovatStyle.tlacitko} mode="contained" onPress={editZavadu}>
            Upraviť závadu
          </Button>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};
