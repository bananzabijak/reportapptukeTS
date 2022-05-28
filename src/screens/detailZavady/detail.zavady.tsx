import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,  
  Image,
  Text,
} from 'react-native';
import { Button, Title} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import * as Progress from 'react-native-progress';
import { detailStyle } from './detail.style';

export const DetailZavady = ({navigation, route}) => { 

  const {ZavadaID, UserUID, UserEmail, ImageUrl} = route.params;

 


  const [nazev, setNazev] = useState('');
  const [obsah, setObsah] = useState('');
  const [mistnost, setMistnost] = useState('');
  const [typZavady, setTypZavady] = useState('');
  const [contact, setContact] = useState('');

  const returnToVsechyZavady = () => {
    navigation.navigate('Nahlasene zavady', {
      UserUID: UserUID,
      UserEmail: UserEmail,
    });
  };

  const [image, setImage] = useState(null);  

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
        setContact(dataZavady?.contact);
        
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
        stav: 'Opravené',
      })
      .then(async () => {
        console.log('Stav závady zmenený');        
        returnToVsechyZavady();
      });
  };
  

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
              <Text style={detailStyle.sekce}>Miestnosť:</Text>
            </View>
            <Text>{mistnost}</Text>
          </View>
          <View>
            <View>
              <Text style={detailStyle.sekce}>Kontant:</Text>
            </View>
            <Text>{contact}</Text>
          </View>
          <View>
            <Text style={detailStyle.sekce}>Popis závady:</Text>
          </View>
          <View>
            <Text>{obsah}</Text>
          </View>

          <View style={detailStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: ImageUrl}} style={detailStyle.imageBox} />
            ) : null}            
          </View>
          <Button style={detailStyle.buttonOdeslat} icon="arrow-right" mode="contained" onPress={editZavadu}>
            Označit za vyriešené
          </Button>
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};
