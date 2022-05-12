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
import {vyreneseStyle} from './vyresene.style';
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

export const VyreseneZavady = ({navigation, route}: any) => {
  const {UserUID, UserEmail} = route.params;
  const [arrayZavad, setArray] = useState<IZavada[]>([]);

  const getVsechnyZavadyOdUsera = useCallback(async () => {
    firestore()
      .collection<IZavada>('Zavady')
      // Filter results
      .where('stav', 'in', ['Opravené'])         
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
    <View style={vyreneseStyle.content}> 
  
      
      
        <SafeAreaView>
          <View style={vyreneseStyle.zahlavi}> 
          <Title style={vyreneseStyle.nadpis}>Vyriešené závady</Title>
          </View> 
         <ScrollView>  

          <FlatList
            data={arrayZavad}
            keyExtractor={item => item.id!}
            renderItem={({item}) => (
              <View style={vyreneseStyle.container}>
                <Text style={vyreneseStyle.nazev}>{item.nazev}</Text>
                <Text style={vyreneseStyle.stav}>{item.stav}</Text>
                <View style={vyreneseStyle.popisek}>
                <Text numberOfLines={1} style={vyreneseStyle.typy}>
                    {item.mistnost}
                  </Text>
                  <Text numberOfLines={1} style={vyreneseStyle.typy}>
                   {item.typ}
                  </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>
                  {item.popis.slice(0, 30) + "..."}
                </Text>
                </View>
                <View style={vyreneseStyle.ikonka}>
                  {item.imageUrl && (
                    <Image
                      style={vyreneseStyle.fotka}
                      source={{
                        uri: item.imageUrl,
                      }}
                    />
                  )}
                </View>
                <Button
                  icon="pencil"
                  mode="contained"
                  style={vyreneseStyle.tlacitko}
                  onPress={() => editovatZavadu(item.id!, item.imageUrl!)}>
                  Zobraziť
                </Button>
              </View>
            )}
          /> 
          </ScrollView>
        </SafeAreaView>
     
        <View style={vyreneseStyle.corner}>        
        <Button
                  icon="folder-alert-outline"
                  mode="contained"
                  style={vyreneseStyle.filter}
                  onPress={navNovaZavada}>
                  Nahlásené
                </Button>
      </View> 
    </View>
  );
};
