import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import appHeader from '../images/header.jpg';
import Icon from "react-native-vector-icons/Ionicons";


export default class ContactsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [], message: "", newContacts: "",
            searchedContacts: [], searchedValue: ""
        };
    }

    loadContacts = async () => {
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch('http://localhost:3333/api/1.0.0/contacts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
            else {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }
    }

    deleteContact = async (id) => {
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                this.loadContacts();
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST, CAN'T DELETE YOURSELF" });
            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
            else if (serverOutput.status === 404) {
                console.log("USER NOT FOUND");
                this.setState({ message: "USER NOT FOUND, ENTER VALID ID" });
            }
            else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN LATER" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }
    }

    addContact = async (id) => {
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ id }),
            });

            if (serverOutput.status === 200) {
                this.loadContacts();
            } else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST, CAN'T ADD YOURSELF" });

            } else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });

            } else if (serverOutput.status === 404) {
                console.log("USER NOT FOUND");
                this.setState({ message: "USER NOT FOUND, ENTER VALID ID" });

            } else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN LATER" });
            }
        } catch (message) {
            console.error("ERROR:", message);
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
                    <View style={styles.header}>
                        <View style={styles.headerCon}>
                        <TouchableOpacity>
                            <Icon name="md-person-add" size={25} color="#14c83c" />
                        </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Contacts </Text>
                            <TouchableOpacity>
                                <Ionicons name="block" size={25} color="#CC0000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.headerCon}>
                        <TextInput
                            id="searchValue"
                            placeholder="Search Contacts"
                            placeholderTextColor={"#C0C0C0"}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.listBox}>
                        <Text></Text>
                    </View>

                    <View style ={styles.addButton}>
                        
                    </View>

                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create
    ({
        addButton:
        {
            justifyContent: "flex-end",
            alignItems: "flex-end",
            margin: 10,
            marginRight: 25,
            bottom: 0,
        },
        listBox:
        {
            marginTop: 15,
            backgroundColor: "#D9D9D9",
            width: "90%",
            marginLeft: 17,
            paddingTop: 540,

        },
        header:
        {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        headerCon:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",

        },
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
        input: {
            borderBottomColor: '#34633E',
            borderBottomWidth: 2,
            padding: 8,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
            marginTop: 10,
            width: "90%",
            marginRight: 5,

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

    });