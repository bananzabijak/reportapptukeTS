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
import {Button, Title, FAB, TextInput, Appbar, Divider, Searchbar} from 'react-native-paper';
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
  const [searchQuery, setSearchQuery] = React.useState(''); 

  const onChangeSearch = query => setSearchQuery(query);

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
    navigation.navigate('Vyresene zavady', {
      UserUID: UserUID,
      UserEmail: UserEmail,
    });
  };

  const navFiltrZavada = () => {
    navigation.navigate('Filtrovane zavady', {
      Data: filtrovatZavady(),
      UserEmail: UserEmail,
      UserUID: UserUID
    });
  };



  const filtrovatZavady = () => {

    const data = arrayZavad.filter(function(item){
      return (item.typ.toLowerCase().includes(searchQuery.toLowerCase()) || item.mistnost.toLowerCase().includes(searchQuery.toLowerCase())|| item.popis.toLowerCase().includes(searchQuery.toLowerCase()));
   }).map(function({id, imageUrl, mistnost, nazev, popis, typ, user, image, stav}){
       return {id, imageUrl, mistnost, nazev, popis, typ, user, image, stav}  ;
   });
   console.log(data);
   return data;
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

  return (
    <View style={nahlaseneStyle.content}> 
  
      
      
        <SafeAreaView>  
        <View style={nahlaseneStyle.zahlavi}> 
          <Title style={nahlaseneStyle.nadpis}>Nahlásené závady</Title>
          </View>  

          <View style={nahlaseneStyle.filterContainer}>   
          <Searchbar
      placeholder="Vyhladať v závadách"
      onChangeText={onChangeSearch}
      value={searchQuery}
      onIconPress={navFiltrZavada}
    />         
       
            </View>                 
         <ScrollView>  

          <FlatList
           data={arrayZavad}
            keyExtractor={item => item.id!}
            renderItem={({item}) => (
              <View style={nahlaseneStyle.container}>
                <Text style={nahlaseneStyle.nazev}>{item.nazev}</Text>
                <Text style={nahlaseneStyle.stav}>{item.stav}</Text>
                <View style={nahlaseneStyle.popisek}>
                <Text numberOfLines={1} style={nahlaseneStyle.typy}>
                    {item.mistnost}
                  </Text>
                  <Text numberOfLines={1} style={nahlaseneStyle.typy}>
                   {item.typ}
                  </Text>
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
                  onPress={() => editovatZavadu(item.id!, item.imageUrl!)}>
                  Zobraziť
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
                  Vyriešeno
                </Button>
      </View>       
      
    </View>
  );
};
