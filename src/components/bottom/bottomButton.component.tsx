import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { Button, Card, TextInput, FAB  } from "react-native-paper";
import { Image } from "react-native";
import { bottomStyle } from "./bottom.style";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



export const BottomComponent = ({navigation}) => {

const navNovaZavada = () => {

    navigation.navigate("Nova zavada");
}

    return (
        <FAB
        style={bottomStyle.fab} //proč nefunguje style? nebo spíš proč abosulte position set na right 0 bottom 0 furt bere position textu ne celého view
        icon="plus"
        onPress={onPressNav}
        
    />  
    )
}