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
import {vsechnyStyle} from './vsechny.style';
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
  datum?: string;
}

export const VsechnyZavady = ({navigation, route}: any) => {
  const {UserUID, UserEmail} = route.params;
  const [arrayZavad, setArray] = useState<IZavada[]>([]);

  const getVsechnyZavadyOdUsera = useCallback(async () => {
    firestore()
      .collection<IZavada>('Zavady')
      // Filter results
      .where('user', '==', UserUID)
      .limit(10)
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
    navigation.navigate('Nova zavada', {
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
    <View style={vsechnyStyle.content}> 
  
      
      
        <SafeAreaView>  
        <View style={vsechnyStyle.zahlavi}> 
          <Title style={vsechnyStyle.nadpis}>V??echny z??vady</Title>
          </View>

         <ScrollView>  

          <FlatList
            data={arrayZavad}
            keyExtractor={item => item.id!}
            renderItem={({item}) => (
              <View style={vsechnyStyle.container}>
                <Text style={vsechnyStyle.nazev}>{item.nazev}</Text>
                <View style={vsechnyStyle.popisek}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>
                  {item.popis.slice(0, 30) + "..."}
                </Text>
                </View>
                <View style={vsechnyStyle.ikonka}>
                  {item.imageUrl && (
                    <Image
                      style={vsechnyStyle.fotka}
                      source={{
                        uri: item.imageUrl,
                      }}
                    />
                  )}
                </View>
                <Button
                  icon="pencil"
                  mode="contained"
                  style={vsechnyStyle.tlacitko}
                  onPress={() => editovatZavadu(item.id!)}>
                  Editovat
                </Button>
              </View>
            )}
          /> 
          </ScrollView>
        </SafeAreaView>
     
      <View style={vsechnyStyle.corner}>
        <FAB
          style={vsechnyStyle.fabka} //pro?? nefunguje style? nebo sp???? pro?? abosulte position set na right 0 bottom 0 furt bere position textu ne cel??ho view
          icon="plus"
          onPress={navNovaZavada}
        />
      </View>
    </View>
  );
};
