import React, { Component } from 'react';
import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';
import { LoginScreen } from './src/screens/login/login.screen';
import { theme } from './App.style';
import { NovaZavada } from './src/screens/novaZavada/nova.zavada';
import firestore from '@react-native-firebase/firestore';
import { DetailZavady } from './src/screens/detailZavady/detail.zavady';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NahlaseneZavady } from './src/screens/nahlaseneZavady/nahlasene.zavady';
import { VyreseneZavady } from './src/screens/vyreseneZavady/vyresene.zavady';

const Stack = createStackNavigator();


const App = () => {

  return (

    <NavigationContainer> 
      <PaperProvider theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component= {LoginScreen} options={{header: () => null}}/>
        <Stack.Screen name="Vsechny zavady" component= {NahlaseneZavady} options={{header: () => null}}/> 
        <Stack.Screen name="Editovat zavadu" component= {DetailZavady} options={{header: () => null}}/>        
        <Stack.Screen name="Nova zavada" component= {NovaZavada} options={{header: () => null}}/>        
        <Stack.Screen name="Vyřešené závady" component= {VyreseneZavady} options={{header: () => null}}/>          
      </Stack.Navigator>     
      </PaperProvider >
    </NavigationContainer>
  );
};

export default App;