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
import {nahlaseneStyle} from './nahlasene.style';
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

export const NahlaseneZavady = ({navigation, route}: any) => {
  const {UserUID, UserEmail} = route.params;
  const [arrayZavad, setArray] = useState<IZavada[]>([]);

  const getVsechnyZavadyOdUsera = useCallback(async () => {
    firestore()
      .collection<IZavada>('Zavady')
      // Filter results
      .where('stav', 'in', ['Nové', 'Upraveno'])         
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
    navigation.navigate('Vyřešené závady', {
      UserUID: UserUID,
      UserEmail: UserEmail,
    });
  };

  const editovatZavadu = (zavadaID: string) => {
    navigation.navigate('Editovat zavadu', {
      ZavadaID: zavadaID,
      UserUID: UserUID,
      UserEmail: UserEmail,
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
    <View style={nahlaseneStyle.content}> 
  
      
      
        <SafeAreaView>  
          <Title style={nahlaseneStyle.nadpis}>Všechny závady</Title>
         <ScrollView>  

          <FlatList
            data={arrayZavad}
            keyExtractor={item => item.id!}
            renderItem={({item}) => (
              <View style={nahlaseneStyle.container}>
                <Text style={nahlaseneStyle.nazev}>{item.nazev}</Text>
                <Text style={nahlaseneStyle.stav}>{item.stav}</Text>
                <View style={nahlaseneStyle.popisek}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>
                  {item.popis.slice(0, 30) + "..."}
                </Text>
                </View>
                <View style={nahlaseneStyle.ikonka}>
                  {item.imageUrl && (
                    <Image
                      style={nahlaseneStyle.fotka}
                      source={{
                        uri: item.imageUrl,
                      }}
                    />
                  )}
                </View>
                <Button
                  icon="pencil"
                  mode="contained"
                  style={nahlaseneStyle.tlacitko}
                  onPress={() => editovatZavadu(item.id!)}>
                  Zobrazit
                </Button>
              </View>
            )}
          /> 
          </ScrollView>
        </SafeAreaView>
     
        <View style={nahlaseneStyle.corner}>        
        <Button
                  icon="folder-check-outline"
                  mode="contained"
                  style={nahlaseneStyle.filter}
                  onPress={navNovaZavada}>
                  Vyřešené
                </Button>
      </View> 
    </View>
  );
};
