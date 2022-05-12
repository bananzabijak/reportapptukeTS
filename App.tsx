import React, { Component } from 'react';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';
import { LoginScreen } from './src/screens/login/login.screen';
import { theme } from './App.style';
import { NovaZavada } from './src/screens/novaZavada/nova.zavada';
import { EditovatZavadu } from './src/screens/editovatZavadu/editovat.zavadu';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { VsechnyZavady } from './src/screens/vsechnyZavady/vsechny.zavady';
import { VyreseneZavady } from './src/screens/vyreseneZavady/vyresene.zavady';
import { NahlaseneZavady } from './src/screens/nahlaseneZavady/nahlasene.zavady';
import { DetailZavady } from './src/screens/detailZavady/detail.zavady';
import { FiltrovaneZavady } from './src/screens/filtrovaneZavady/filtrovane.zavady';

const Stack = createStackNavigator();


const App = () => {

  return (

    <NavigationContainer> 
      <PaperProvider theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component= {LoginScreen} options={{header: () => null}}/>
        <Stack.Screen name="Vsechny zavady" component= {VsechnyZavady} options={{header: () => null}}/> 
        <Stack.Screen name="Editovat zavadu" component= {EditovatZavadu} options={{header: () => null}}/>        
        <Stack.Screen name="Nova zavada" component= {NovaZavada} options={{header: () => null}}/>  
        <Stack.Screen name="Vyresene zavady" component= {VyreseneZavady} options={{header: () => null}}/>   
        <Stack.Screen name="Nahlasene zavady" component= {NahlaseneZavady} options={{header: () => null}}/>   
        <Stack.Screen name="Detail zavady" component= {DetailZavady} options={{header: () => null}}/>  
        <Stack.Screen name="Filtrovane zavady" component= {FiltrovaneZavady} options={{header: () => null}}/>  

      </Stack.Navigator>     
      </PaperProvider >
    </NavigationContainer>
  );
};

export default App;