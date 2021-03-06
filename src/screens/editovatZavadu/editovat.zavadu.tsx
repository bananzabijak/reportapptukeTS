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
import {HeaderComponent} from '../../components/header/header.component';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';

export const EditovatZavadu = ({navigation, route}) => {
  const [expanded, setExpanded] = React.useState(true);

  const {ZavadaID, UserUID, UserEmail} = route.params;

  const handlePress = () => setExpanded(!expanded);

  const zavadyCollection = firestore().collection('Zavady');

  //const [zavada, setZavada] = useState<IZavada>();
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

  const reference = storage().ref(
    'gs://reportapptukets.appspot.com/Zavady/Fotky',
  );

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
    // set progress state
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
    Alert.alert('Zavada editov??na!');
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
        // setZavada(dataZavady);
        setMistnost(dataZavady?.mistnost);
        setTypZavady(dataZavady?.typ);
        setObsah(dataZavady?.popis);
        setNazev(dataZavady?.nazev);
        setImage(dataZavady?.image);
        //  console.log("Zavada" , zavada);
      });

    //console.log("Zavada venku" , zavada);

    //return zavada ; // chci vracet z??vadu
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
    //console.log(zavada);
  }, []);

  const getPopis = async (zavada: {get: (arg0: string) => any}) => {
    const popisPredEditem = zavada.get('popis'); //tu bych cht??l tady krmit
    console.log(zavada);

    console.log(zavada.get('nazev'));

    return popisPredEditem; 
  };

  const getNazev = async zavada => {
    const nazevPredEditem = zavada.get('nazev');
    console.log(zavada);

    console.log(zavada.get('nazev'));

    return nazevPredEditem; // to sam??
  };

  const editZavadu = () => {
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
        stav: "Upraveno",        
      })
      .then(async () => {
        console.log('Zavada p??id??na');
        await uploadImage();
        returnToVsechyZavady();
      });
  };

  // const subscriber = firestore().collection("Zavady").doc('9N4bnOvZyQaLMIvJyVpC').onSnapshot(doc => { }) tady jsem d??lal pokusy pak pro vypisov??n?? z??vad

  return (
    <SafeAreaView>
      <ScrollView>
      <View style={editovatStyle.zahlavi}> 
          <Title style={editovatStyle.nadpis}>Editovat z??vadu</Title>
          </View>
        <View style={editovatStyle.content}>
          <TextInput
            style={editovatStyle.nazev}
            label="N??zev Z??vady"
            maxLength={20}
            onChangeText={newNazev => setNazev(newNazev)}
            value={nazev}></TextInput>
          <List.AccordionGroup>
            <List.Accordion
              title="Typ Z??vady"
              expanded={expanded}
              onPress={handlePress}
              id="1">
              <List.Item
                style={editovatStyle.listItem}
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
            style={editovatStyle.popis}
            placeholder="Stru??n?? popi??t?? z??vadu"
            maxLength={400}
            onChangeText={newObsah => setObsah(newObsah)}
            value={obsah}></TextInput>

          <View style={editovatStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: image.uri}} style={editovatStyle.imageBox} />
            ) : null}
            {uploading ? (
              <View style={editovatStyle.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : null}
          </View>
          <Button icon="camera" style={editovatStyle.tlacitko} mode="contained" onPress={selectImage}>
            Vybrat obr??zek
          </Button>
          <Button icon="arrow-right" style={editovatStyle.tlacitko} mode="contained" onPress={editZavadu}>
            Editovat z??vadu
          </Button>
        </View>
      </ScrollView>

      {/* <BottomComponent /> */}
    </SafeAreaView>
  );
};
