import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, PermissionsAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { logOut } from "../request/logout"

import appHeader from "../images/header.jpg";
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Entypo";

export default class ContactsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contacts: [], message: "",
            searchedContacts: [], searchedValue: "", loadReady: true,
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
                this.setState({ contacts: data });
                console.log("LOADED CONTACTS");
            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
            else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }
    }

    removeContact = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id;

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
                console.log("USER DELETED, ID:", id);
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
        const id = item.user_id;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({id}),
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

    blockContact = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({id}),
            });

            if (serverOutput.status === 200) {
                this.loadContacts();
                console.log("USER BLOCK, ID:", id);
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

    searchFunction = async (query, limit = 20, offset = 0) => {
        const sessiontoken = await AsyncStorage.getItem("session_token");

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
                    <Icon name="md-person-add" size={15} color="#14c83c" />
                </TouchableOpacity>
            </View>
        );
    };

    contactItem = ({ item }) => {
        return (
            <View style={styles.searchItems}>
                <Text style={styles.searchText}>
                    {item.first_name} {item.last_name}
                </Text>
                <View style={styles.buttonControl}>
                    <View style={styles.space}>
                        <TouchableOpacity
                            onPress={() => this.blockContact(item)}>
                            <Ionicons name="block" size={15} color="#CC0000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.space}>
                        <TouchableOpacity
                            onPress={() => this.removeContact(item)}>
                            <Icon name="person-remove" size={15} color="#0f3d0f" />
                        </TouchableOpacity>
                    </View>


                </View>

            </View>
        );
    };

    logOutUser = async () => {
        try {
            const serverOutput = await logOut();
            if (serverOutput === 200) {
                await AsyncStorage.removeItem("session_token");
            }
            this.tologIn();
        } catch (message) {
            this.setState({ error: error.message });
        }
    }

    tologIn = () => {
        this.props.navigation.navigate("login");
    };
    toBlocked = () => {
        this.props.navigation.navigate("blocked");
    };

    render() {
        if (this.state.loadReady === true) {
            this.loadContacts();
            this.setState({ loadReady: false });
        }
        return (
            <View>
                <img
                    id="appHeader"
                    src={appHeader} className="appHeader"

                />

                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerCon}>
                            <TouchableOpacity
                                onPress={() => this.toBlocked()}>
                                <Ionicons name="block" size={25} color="#CC0000" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Contacts </Text>
                            <TouchableOpacity
                                onPress={() => this.logOutUser()}>
                                <Feather name="log-out" size={25} color="#14c83c" />
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
                                ListEmptyComponent={<Text style={styles.formText}>No Contacts Found</Text>}
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
        space:
        {
            marginLeft: 30,
        },
        buttonControl:
        {
            flexDirection: "row",
            marginLeft: 10,
        },
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
            marginTop: 5,
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
            width: "90%",
            marginLeft: 17,
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