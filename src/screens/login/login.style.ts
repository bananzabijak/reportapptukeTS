import { StyleSheet } from "react-native";

export const loginStyle = StyleSheet.create(
    {
        content: {
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#281C2D"



        },
        view: {

            width: "80%"

        },
        viewImg: {
            width: "10%",
            height: "10%",
            position: 'absolute',
            bottom: 50,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',


        },
        cardTitle: {
            textAlign: "center",
            color: "#281C2D"
        },
        cardButton: {
            margin: 10,
            marginLeft: 0,
            marginRight: 0,

        },
        logo: {
            width: 100,
            height: 100,
          },


    })