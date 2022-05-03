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
    Alert.alert('Závada pridaná!');
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
        stav: "Nové",        
      })
      .then(async () => {
        console.log('Závada pridaná');
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
          <Title style={novaStyle.nadpis}>Nová závada</Title>
          </View>
          <View style={novaStyle.content}>
            <TextInput
              label="Názov"
              onChangeText={newNazev => setNazev(newNazev)}
              maxLength={20}
              defaultValue={nazev}></TextInput>
            <List.AccordionGroup>
              <List.Accordion
                title="Typ Závady"
                expanded={expanded}
                onPress={handlePress}
                id="1">
                <List.Item
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
                  title="KKUI Sinčák"
                  onPress={() => {
                    setMistnost('KKUI Sinčák');
                  }}
                />
                <List.Item
                  title="KKUI virtual"
                  onPress={() => {
                    setMistnost('KKUI virtual');
                  }}
                />
                <List.Item
                  title="N3_018(LUI_1)"
                  onPress={() => {
                    setMistnost('N3_018(LUI_1)');
                  }}
                />
                <List.Item
                  title="N3_018(LUI_2)"
                  onPress={() => {
                    setMistnost('N3_018(LUI_2)');
                  }}
                />
                <List.Item
                  title="V4_147"
                  onPress={() => {
                    setMistnost('V4_147');
                  }}
                />
                <List.Item
                  title="V4_010"
                  onPress={() => {
                    setMistnost('V4_010');
                  }}
                />
                <List.Item
                  title="V4_146(V101b)"
                  onPress={() => {
                    setMistnost('V4_146(V101b)');
                  }}
                />
                <List.Item
                  title="V4_109(V144)"
                  onPress={() => {
                    setMistnost('V4_109(V144)');
                  }}
                />
                <List.Item
                  title="L9-B520"
                  onPress={() => {
                    setMistnost('L9-B520');
                  }}
                />
                <List.Item
                  title="V4_011(V002)"
                  onPress={() => {
                    setMistnost('V4_011(V002)');
                  }}
                />
                <List.Item
                  title="V4_V102"
                  onPress={() => {
                    setMistnost('V4_V102');
                  }}
                />
                <List.Item
                  title="L9-A536"
                  onPress={() => {
                    setMistnost('L9-A536');
                  }}
                />
                <List.Item
                  title="L9-A537"
                  onPress={() => {
                    setMistnost('L9-A537');
                  }}
                />
                <List.Item
                  title="L9-A504"
                  onPress={() => {
                    setMistnost('L9-A504');
                  }}
                />
                <List.Item
                  title="L9-B527"
                  onPress={() => {
                    setMistnost('L9-B527');
                  }}
                />
                <List.Item
                  title="L9-B529"
                  onPress={() => {
                    setMistnost('L9-B529');
                  }}
                />
                <List.Item
                  title="L9-B526"
                  onPress={() => {
                    setMistnost('L9-B526');
                  }}
                />
                <List.Item
                  title="L9-A512"
                  onPress={() => {
                    setMistnost('L9-A512');
                  }}
                />
                <List.Item
                  title="L9-B524"
                  onPress={() => {
                    setMistnost('L9-B524');
                  }}
                />
                <List.Item
                  title="L9-A538"
                  onPress={() => {
                    setMistnost('L9-A538');
                  }}
                />
                <List.Item
                  title="L9-B519/B"
                  onPress={() => {
                    setMistnost('L9-B519/B');
                  }}
                />
                <List.Item
                  title="L9-B518"
                  onPress={() => {
                    setMistnost('L9-B518');
                  }}
                />
                <List.Item
                  title="L9-A534"
                  onPress={() => {
                    setMistnost('L9-A534');
                  }}
                />
                <List.Item
                  title="L9-A532"
                  onPress={() => {
                    setMistnost('L9-A532');
                  }}
                />
                <List.Item
                  title="KPI virtual"
                  onPress={() => {
                    setMistnost('KPI virtual');
                  }}
                />
                <List.Item
                  title="L9-A514"
                  onPress={() => {
                    setMistnost('L9-A514');
                  }}
                />
              </List.Accordion>
            </List.AccordionGroup>

            <TextInput
              multiline
              numberOfLines={4}
              style={novaStyle.popis}
              placeholder="Stručne popíšte závadu"
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
            Vybrať obrázok
            </Button>
            <Button style={novaStyle.tlacitko} icon="arrow-right" mode="contained" onPress={uploadZavadu}>
            Nahlásiť závadu
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
