import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/Fontisto";

import appHeader from '../images/header.jpg';

export default class Editscreen extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    toSetting = () => {
        this.props.navigation.navigate("settings");
    };

    render() {
        return (
            <View>
                <img
                    id="appHeader"
                    src={appHeader} className="appHeader"
                />
                <View style={styles.container}>

                    <View style={styles.header}>
                        <View style={styles.headerCon}>
                            <TouchableOpacity>
                                <Icon name="edit" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Edit Profile </Text>
                            <TouchableOpacity onPress={() => this.toSetting()}>
                                <Icon name="close" size={25} color="#CC0000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create
    ({
        formAppTitle:
        {
            marginLeft: 65,
            marginRight: 65,
            marginTop: 30,
            fontSize: 16,
            color: '#34633E',
            fontWeight: 'bold',
            marginBottom: 30,
        },
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
        container:
        {
            height: 680,

        },
        input:
        {
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
        button:
        {
            backgroundColor: '#CC0000',
            padding: 8,
            paddingRight: 16,
            paddingLeft: 16,
            marginRight: 25,
            marginLeft: 25,
            bottom: 0,
            margin: 20,

        },
        buttonText: {
            textAlign: "center",
            justifyContent: "center",
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
        header:
        {
            flex: 1,
            alignItems: "center"
        },
        headerCon:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",



        },
        absoluteOpacity:
        {

        },
    });