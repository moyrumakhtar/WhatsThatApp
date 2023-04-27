import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import appHeader from '../images/header.jpg';

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View>
                 <img
                    id="appHeader"
                    src={appHeader} className="appHeader"
                />
                <View style={styles.container}>
       
                  
                </View>
               
            </View>
        );
    }

}

const styles = StyleSheet.create
    ({
        formTitle:
        {
            textAlign: "center",
            marginTop: 40,
            fontSize: 16,
            color: '#34633E',
            fontWeight: 'bold',
            marginBottom: 30,
        },
        formText:
        {
            padding: 5,
            color: 'black',
            marginTop: 0,
            margin: 40,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
        },
        container: {
            flex: 1,

        },
        input: {
            borderBottomColor: '#14c83c',
            borderBottomWidth: 2,
            padding: 8,
            margin: 40,
            marginBottom: 30,
            marginTop: 5,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',

        },
        button: {
            backgroundColor: '#14c83c',
            margin: 40,
            marginTop: 10,
            marginBottom: 10,
            paddingTop: 10,
            paddingBottom: 10,


        },
        buttonText: {
            textAlign: "center",
            color: '#FFFFFF'

        },
        formLoginText:
        {
            color: 'black',
            marginTop: 0,
            marginBottom: 0,
            fontSize: 13,
            color: '#C0C0C0',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        message: {
            color: '#CC0000',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold',
            margin: 10,
        },
        errorInput: {
            borderBottomColor: '#CC0000',
            borderBottomWidth: 2,
            padding: 8,
            margin: 40,
            marginBottom: 30,
            marginTop: 5,
            fontSize: 13,
            color: '#C0C0C0',
            fontWeight: 'bold',

        },
    });