import React, { useState, useEffect } from "react";
import { Appbar } from "react-native-paper";
import auth from '@react-native-firebase/auth';
import { Button, Card, TextInput } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


export const HeaderComponent = (props: HeaderComponentParams) => {

    const singOutUser = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    };

    return (
        <Appbar>
            <Appbar.BackAction />
            <Appbar.Content title={props.title}>
            </Appbar.Content>
        </Appbar>
    )
}

interface HeaderComponentParams  {
title: string,

}