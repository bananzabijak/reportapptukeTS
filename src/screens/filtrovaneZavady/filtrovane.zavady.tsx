import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  LogBox,
  Image,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {filtrovaneStyle} from './filtrovane.style';
import {Button, Title, FAB} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import storage from '@react-native-firebase/storage';

interface IZavada {
  id?: string;
  imageUrl?: string | null;
  mistnost: string;
  nazev: string;
  popis: string;
  typ: string;
  user: string;
  image?: {
    uri?: string;
  };
  stav: string;
}

export const FiltrovaneZavady = ({navigation, route}: any) => {
  const {UserUID, UserEmail, Data} = route.params;
  const [arrayZavad, setArray] = useState<IZavada[]>([]);

  const getVsechnyZavadyOdUsera = useCallback(async () => {
    firestore()
      .collection<IZavada>('Zavady')
      // Filter results
      .where('stav', 'in', ['Nové', 'Upravené'])              
      .get()
      .then(async querySnapshot => {
        const dataArr: any[] = [];
        for await (const documentSnapshot of querySnapshot.docs) {
          const data = documentSnapshot.data();
          let imageUrl = null;
          if (data.image?.uri) {
            imageUrl = await storage().ref(data.image.uri).getDownloadURL();
          }

          const newZavada = {
            id: documentSnapshot.id,
            imageUrl,
            ...data,
          };
          dataArr.push(newZavada);
        }
        setArray(dataArr);
      });
  }, [UserUID]);

  const navNovaZavada = () => {
    navigation.navigate('Nahlasene zavady', {
      UserUID: UserUID,
      UserEmail: UserEmail,
    });
  };

  const filtrovatZavady = () => {

    const data = arrayZavad.filter(function(item){
      return item.typ == 'Tabula';
   }).map(function({id, imageUrl, mistnost, nazev, popis, typ, user, image, stav}){
       return {id, imageUrl, mistnost, nazev, popis, typ, user, image, stav};
   });
   console.log(data);
  }

  const editovatZavadu = (zavadaID: string, imageUrl: string) => {
    navigation.navigate('Detail zavady', {
      ZavadaID: zavadaID,
      UserUID: UserUID,
      UserEmail: UserEmail,
      ImageUrl: imageUrl
      
    });
  };

  useEffect(() => {
    getVsechnyZavadyOdUsera();
    return () => {
      setArray([]);
    };
  }, [getVsechnyZavadyOdUsera, route]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  // Temporary stylesheet, delete after refactoring
  const styles = StyleSheet.create({
    img: {
      flex: 1,
      width: 50,
      height: 50,
      resizeMode: 'cover',
    },
  });

  return (
    <View style={filtrovaneStyle.content}> 
  
      
      
        <SafeAreaView>  
        <View style={filtrovaneStyle.zahlavi}> 
          <Title style={filtrovaneStyle.nadpis}>Filtrované závady</Title>
          </View>
         <ScrollView>  

          <FlatList
            data={Data}
            keyExtractor={item => item.id!}
            renderItem={({item}) => (
              <View style={filtrovaneStyle.container}>
                <Text style={filtrovaneStyle.nazev}>{item.nazev}</Text>
                <Text style={filtrovaneStyle.stav}>{item.stav}</Text>
                <View style={filtrovaneStyle.popisek}>
                <Text numberOfLines={1} style={filtrovaneStyle.typy}>
                    {item.mistnost}
                  </Text>
                  <Text numberOfLines={1} style={filtrovaneStyle.typy}>
                   {item.typ}
                  </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>
                  {item.popis.slice(0, 30) + "..."}
                </Text>
                </View>
                <View style={filtrovaneStyle.ikonka}>
                  {item.imageUrl && (
                    <Image
                      style={filtrovaneStyle.fotka}
                      source={{
                        uri: item.imageUrl,
                      }}
                    />
                  )}
                </View>
                <Button
                  icon="pencil"
                  mode="contained"
                  style={filtrovaneStyle.tlacitko}
                  onPress={() => editovatZavadu(item.id!, item.imageUrl!)}>
                  Zobraziť
                </Button>
              </View>
            )}
          /> 
          </ScrollView>
        </SafeAreaView>
     
        <View style={filtrovaneStyle.corner}>        
        <Button
                  icon="arrow-left-top-bold"
                  mode="contained"
                  style={filtrovaneStyle.filter}
                  onPress={navNovaZavada}>
                  Zpět
                </Button>
      </View>       
    </View>
  );
};
