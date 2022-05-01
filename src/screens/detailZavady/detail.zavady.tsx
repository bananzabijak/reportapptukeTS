import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Platform,
  Alert,
  Image,
  Text,
} from 'react-native';
import {TextInput, List, Button, Title} from 'react-native-paper';
import {HeaderComponent} from '../../components/header/header.component';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import { detailStyle } from './detail.style';

export const DetailZavady = ({navigation, route}) => {
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
        // setZavada(dataZavady);
        setMistnost(dataZavady?.mistnost);
        setTypZavady(dataZavady?.typ);
        setObsah(dataZavady?.popis);
        setNazev(dataZavady?.nazev);
        setImage(dataZavady?.image);
        //  console.log("Zavada" , zavada);
      });

    //console.log("Zavada venku" , zavada);

    //return zavada ; // chci vracet závadu
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
    const popisPredEditem = zavada.get('popis'); //tu bych chtěl tady krmit
    console.log(zavada);

    console.log(zavada.get('nazev'));

    return popisPredEditem;
  };

  const getNazev = async zavada => {
    const nazevPredEditem = zavada.get('nazev');
    console.log(zavada);

    console.log(zavada.get('nazev'));

    return nazevPredEditem; // to samé
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
        stav: 'Opraveno',
      })
      .then(async () => {
        console.log('Zavada přidána');
        await uploadImage();
        returnToVsechyZavady();
      });
  };

  // const subscriber = firestore().collection("Zavady").doc('9N4bnOvZyQaLMIvJyVpC').onSnapshot(doc => { }) tady jsem dělal pokusy pak pro vypisování závad

  return (
    <SafeAreaView>
      <ScrollView style={detailStyle.container}>
      <View style={detailStyle.zahlavi}> 
          <Title style={detailStyle.nadpis}>Detail závady</Title>
          </View> 
        <View style={detailStyle.content}>
          <View>
            <Text style={detailStyle.nazev}>{nazev}</Text>
          </View>
          <View>
            <Text style={detailStyle.sekce}>Typ závady:</Text>
          </View>
          <View>
            <Text>{typZavady}</Text>
          </View>
          <View>
            <View>
              <Text style={detailStyle.sekce}>Mistnost:</Text>
            </View>
            <Text>{mistnost}</Text>
          </View>
          <View>
            <Text style={detailStyle.sekce}>Popis závady:</Text>
          </View>
          <View>
            <Text>{obsah}</Text>
          </View>

          <View style={detailStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: image.uri}} style={detailStyle.imageBox} />
            ) : null}
            {uploading ? (
              <View style={detailStyle.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : null}
          </View>
          <Button style={detailStyle.buttonOdeslat} icon="arrow-right" mode="contained" onPress={editZavadu}>
            Označit za opravené
          </Button>
        </View>
      </ScrollView>

      {/* <BottomComponent /> */}
    </SafeAreaView>
  );
};
