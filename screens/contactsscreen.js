import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Entypo';

import appHeader from '../images/header.jpg';
import Icon from "react-native-vector-icons/Ionicons";

export default class ContactsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [], message: "", newContacts: "",
            searchedContacts: [], searchedValue: "", newContactID: "",
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

    addContact = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ id }),
            });

            if (serverOutput.status === 200) {
                this.loadContacts();
                console.log("USER ADDED, ID:", id)
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

    searchFunction = async (query, limit = 20, offset = 0) => {
        const sessiontoken = await AsyncStorage.getItem('session_token');

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/search?q=${query}&search_in=all&limit=${limit}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessiontoken,
                },
            });
            const data = await serverOutput.json();

            if (serverOutput.status === 200) {
                this.setState({ searchedContacts: data });
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

    searchItem = ({ item }) => {
        return (
            <View style={styles.searchItems}>
                <Text style={styles.searchText}>
                    {item.given_name}{" "}{item.family_name}
                </Text>

                <TouchableOpacity
                onPress={() => this.addContact(item)}>
                    <Icon name="md-person-add" size={15} color="#999999" />
                </TouchableOpacity>
            </View>
        )
    }
    contactItem = ({ item }) => {
        return (
            
            <View style={styles.searchItems}>
                <Text style={styles.searchText}>
                {item.given_name}{" "}{item.family_name}
                </Text>
            </View>

        )

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
                                <Ionicons name="block" size={25} color="#CC0000" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Contacts </Text>
                            <TouchableOpacity>
                                <Icon name="md-person-add" size={25} color="#14c83c" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.headerCon}>
                        <TextInput
                            id="searchValue"
                            placeholder="Search Contacts"
                            placeholderTextColor={"#C0C0C0"}
                            onChangeText={(text) => this.setState({ searchedValue: text })}
                            onChange={() => this.searchFunction(this.state.searchedValue)}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.listBox}>
                        {this.state.searchedValue && this.state.searchedContacts.length > 0 ? (
                            <FlatList
                                data={this.state.searchedContacts}
                                renderItem={this.searchItem}
                                ListEmptyComponent={<Text style={styles.formText}> No Search Found </Text>}

                            />
                        ) : (
                            <FlatList
                                data={this.state.contacts}
                                renderItem={this.contactItem}
                                ListEmptyComponent={<Text style={styles.formText}>No Contact Found</Text>}
                            />
                        )
                        }
                    </View>


                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create
    ({
        searchTextHeader:
        {
            marginLeft: 30,
            marginRight: 30,
            marginTop: 30,
            fontSize: 15,
            color: '#546156',
            fontWeight: 'bold',
            marginBottom: 10,

        },
        searchText:
        {
            padding: 5,
            color: 'black',
            marginTop: 0,
            margin: 30,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
        },
        searchItems:
        {
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
        },
        listBox:
        {
            marginTop: 15,
            // backgroundColor: "#D9D9D9",
            width: "90%",
            marginLeft: 17,
            //paddingTop: 540,
            height: 510,
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
            textAlign: "center"
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