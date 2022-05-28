import React, {useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,  
  Image,
  Text,
} from 'react-native';
import { List, Button, Title} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';;
import {adminDetailStyle} from './admin.detail.style';

export const AdminDetailZavady = ({navigation, route}) => { 

  const {ZavadaID, UserUID, UserEmail, ImageUrl} = route.params;

 


  const [nazev, setNazev] = useState('');
  const [zamestnanec, setZamestnanec] = useState('');
  const [jmenoZamestnance, setJmenoZamestnance] = useState('');
  const [obsah, setObsah] = useState('');
  const [mistnost, setMistnost] = useState('');
  const [typZavady, setTypZavady] = useState('');
  const [accordionIdExpanded, setAccordionIdExpanded] = useState<
  number | string | undefined
>(undefined);

const handleAccordionPress = (index: number | string | undefined) => {
  if (accordionIdExpanded === index) {
    setAccordionIdExpanded(undefined);
  } else {
    setAccordionIdExpanded(index);
  }
};

const handleSetZamestnanec = (zamestnanecID: string) => {
  setZamestnanec(zamestnanecID); 
  console.log('handle data', zamestnanecID) 
  console.log(zamestnanec);
  setAccordionIdExpanded(undefined);  
  
  

};



  const returnToVsechyZavady = () => {
    navigation.navigate('Admin zavady', {
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
        setZamestnanec(dataZavady?.zamestnanec);
      
        
      });     
    
  };

  const getJmeno = useCallback ( async() => {

    const jmenoZamestnanceGet = await firestore()
        .collection('Zamestnanci')
        .where('UID', '==', zamestnanec)
        .get()
        .then(async querySnapshot => {          
          for await (const documentSnapshot of querySnapshot.docs) {
            const data = documentSnapshot.data();
            console.log('Zametnanecka data', data) ;
            setJmenoZamestnance(data.Jmeno)
            console.log('jmeno', jmenoZamestnance) ;
            
  
          
           

          }
          
        })},[zamestnanec]);



  useEffect(() => {
    getZavada();
    getJmeno();
    return () => {
      setMistnost('');
      setTypZavady('');
      setObsah('');
      setNazev('');
      setImage(null);
      setJmenoZamestnance('')
    };
    
  }, [ ]);  

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
        zamestnanec: zamestnanec, 
        stav: 'Nové',
      })
      .then(async () => {
        console.log('Stav závady zmenený');        
        returnToVsechyZavady();
      });
  };
  

  return (
    <SafeAreaView>
      <ScrollView style={adminDetailStyle.container}>
      <View style={adminDetailStyle.zahlavi}> 
          <Title style={adminDetailStyle.nadpis}>Detail závady</Title>
          </View> 
        <View style={adminDetailStyle.content}>
          <View>
            <Text style={adminDetailStyle.nazev}>{nazev}</Text>
          </View>
          <View>
            <Text style={adminDetailStyle.sekce}>Typ závady:</Text>
          </View>
          <View>
            <Text>{typZavady}</Text>
          </View>
          <View>
            <View>
              <Text style={adminDetailStyle.sekce}>Miestnosť:</Text>
            </View>
            <Text>{mistnost}</Text>
          </View> 
          <View>
            <View>
              <Text style={adminDetailStyle.sekce}>Zamestnanec:</Text>
            </View>
            <Text>{jmenoZamestnance}</Text>
          </View> 
                  
          <View>
            <Text style={adminDetailStyle.sekce}>Popis závady:</Text>
          </View>
          <View>
            <Text>{obsah}</Text>
          </View>

          <View style={adminDetailStyle.imageContainer}>
            {image !== null ? (
              <Image source={{uri: ImageUrl}} style={adminDetailStyle.imageBox} />
            ) : null}
          </View>
         

          <List.AccordionGroup
              expandedId={accordionIdExpanded}
              onAccordionPress={i => handleAccordionPress(i)}>
              <List.Accordion
                title="Vybrat zamestnanca"
                onPress={() => setAccordionIdExpanded(undefined)}
                id="1">
                <List.Item
                  title={"Vladimír Andreánsky - vrátnik"}
                  onPress={() => {
                    handleSetZamestnanec('kOA2chKYOEab9P2lcbt1eRB7FUD3');
                  }}
                />
                <List.Item
                  title="Martin Astaloš - pomocný robotník"
                  onPress={() => {
                    handleSetZamestnanec('jgwk6D32vNMLPpOM99yNJhw7KOf2');
                  }}
                />
                <List.Item
                  title="Daša Bandák - upratovačka"
                  onPress={() => {
                    handleSetZamestnanec('jTyj6TVOPvfqmYyTsudF5Era0dQ2');
                  }}
                />
                <List.Item
                  title="Anna Bazárová - upratovačka"
                  onPress={() => {
                    handleSetZamestnanec('U1BMgB2oOieKUWFNE0qaSeEFJWE3');
                  }}
                />
                <List.Item
                  title="Mária Belušová - upratovačka"
                  onPress={() => {
                    handleSetZamestnanec('oDt7w5KIprPjdJ5xnhbzDrQFOdw2');
                  }}
                />                
              </List.Accordion>
              </List.AccordionGroup> 
              <Button style={adminDetailStyle.buttonOdeslat} icon="arrow-right" mode="contained" onPress={editZavadu}>
              Priradiť zamestnanca
          </Button>

        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};
