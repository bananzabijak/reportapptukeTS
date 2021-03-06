import { StyleSheet } from "react-native";
import { theme } from "../../../App.style";

export const novaStyle = StyleSheet.create(
    {
        popis: {
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
            textShadowColor: "#FFFFFF",
            textDecorationColor: "#FFFFFF",
            activeOutlineColor: "#FFFFFF",
            color: 'white'
        },

        content: {
            padding: 15,
            paddingTop: 2

        },

        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            color: theme.colors.primary


        },
        popisText: {
            color: "#FFFFFF",

        },

        buttonOdeslat:{
            position: 'absolute',
            margin: 16,
            bottom: 0,

        },

        dolniSeparator: {
            position: 'absolute',
            margin: 16,
            alignContent: "center",
            bottom: 0,
            


        },
        tlacitko: {
          marginBottom:5,
          marginLeft: 5,
          marginRight:5
        },

        zahlavi: {
          backgroundColor:'#BB86FC',
          position:"relative",
          paddingBottom:10,
          paddingTop:10,
          borderTopEndRadius: 100,
          borderBottomStartRadius: 100,
          
        },
        nadpis: {
          color: '#000000',
          fontWeight: 'bold',
          textAlign: 'center',    
        },
      

        selectButton: {
            borderRadius: 5,
            width: 150,
            height: 50,
            backgroundColor: '#8ac6d1',
            alignItems: 'center',
            justifyContent: 'center'
          },
          uploadButton: {
            borderRadius: 5,
            width: 150,
            height: 50,
            backgroundColor: '#ffb6b9',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20
          },
          buttonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          },
          imageContainer: {
            marginTop: 30,
            marginBottom: 50,
            alignItems: 'center'
          },
          progressBarContainer: {
            marginTop: 20
          },
          imageBox: {
            width: 300,
            height: 300
          }




    })