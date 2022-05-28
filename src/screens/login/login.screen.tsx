import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, LogBox, Alert} from 'react-native';
import {Button, Card, TextInput} from 'react-native-paper';
import {Image} from 'react-native';
import {loginStyle} from './login.style';
import auth from '@react-native-firebase/auth';

export const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if (user) {
      navigation.navigate('Vsechny zavady');
    }

    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs([
      "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
    ]);
  }, []);

  const loginUser = () => {
    auth()
      .signInWithEmailAndPassword(name, password)
      .then(() => {
        if (user.uid == 'trjjlGyxG0Pc62jxqPaNfcHAkJy1') {
          navigation.navigate('Admin zavady', {
            UserUID: user.uid,
            UserEmail: user.email,
          });
        }
        else if (user.uid == 'kOA2chKYOEab9P2lcbt1eRB7FUD3') { //Zamestnanec vladimir.andreansky@tuke.sk
          navigation.navigate('Nahlasene zavady', {
            UserUID: user.uid,
            UserEmail: user.email,
          });
        }
        else
          navigation.navigate('Vsechny zavady', {
            UserUID: user.uid,
            UserEmail: user.email,
          });
        console.log(user.uid);
      })
      .catch(error => {
        if (error.code == 'auth/invalid-email') {
          Alert.alert('Zadali jste zlé uživateľské meno!');
          console.log('That email address is invalid!');
        }
        if (error.code == 'auth/user-not-found') {
          Alert.alert('K tomuto e mailu neexistuje užívateľský účet');
        }
        if (error.code == 'auth/wrong-password') {
          Alert.alert('Zadali ste zlé heslo!');
        }
      });
  };

  return (
    <SafeAreaView style={loginStyle.content}>
      <View style={loginStyle.viewImg}>
        <Image style={loginStyle.logo} source={require('./logo.png')} />
      </View>
      <View style={loginStyle.view}>
        <Card>
          <Card.Title
            title="TUKE Nahlašovanie Závad"
            titleStyle={loginStyle.cardTitle}></Card.Title>
          <Card.Content>
            <TextInput
              label="Email"
              keyboardType="email-address"
              onChangeText={newName => setName(newName)}
              defaultValue={name}></TextInput>
            <TextInput
              label="Heslo"
              secureTextEntry={true}
              onChangeText={newPassword => setPassword(newPassword)}
              defaultValue={password}></TextInput>
            <Button
              style={loginStyle.cardButton}
              mode="contained"
              onPress={loginUser}>
              Prihlásit sa
            </Button>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};
