import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import appHeader from '../images/header.jpg';
import Icon from "react-native-vector-icons/Fontisto";

export default class BlockScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blocked: [], message: "", blockedReady: true
        };
    }

    loadBlocked = async () => {
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch('http://localhost:3333/api/1.0.0/blocked', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ blocked: data });
                console.log("LOADED BlOCKED");
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

    unblockContact = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                this.loadBlocked();
                console.log("USER BLOCKED, ID:", id);
                this.setState({ message: "USER UNBLOCKED" });
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST, CAN'T BLOCK YOURSELF" });
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

    contactItem = ({ item }) => {
        return (
            <View style={styles.searchItems}>
                <Text style={styles.searchText}>
                    {item.first_name} {item.last_name}
                </Text>
                <View style={styles.buttonControl}>

                    <View style={styles.space}>
                        <TouchableOpacity
                            onPress={() => this.unblockContact(item)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Unblock </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    };

    toContacts = () => {
        this.props.navigation.navigate("contacts");
    };

    render() {
        if (this.state.blockedReady === true) {
            this.loadBlocked();
            this.setState({ blockedReady: false });
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
                            <TouchableOpacity>
                                <Icon name="close" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Blocked Users </Text>
                            <TouchableOpacity
                                onPress={() => this.toContacts()}>
                                <Icon name="close" size={25} color="#CC0000" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.listBox}>
                        {this.state.blocked.length > 0 ? (
                            <FlatList
                                data={this.state.blocked}
                                renderItem={this.contactItem}
                                ListHeaderComponent={() => <Text style={styles.formSubtitle}> Blocked List </Text>}
                                ListEmptyComponent={<Text style={styles.formText}> No Search Found </Text>}

                            />
                        ) : (
                            <FlatList
                                data={this.state.blocked}
                                renderItem={this.contactItem}
                                ListHeaderComponent={() => <Text style={styles.formSubtitle}> Contact List </Text>}
                                ListEmptyComponent={<Text style={styles.formText}>No Blocked Contacts</Text>}
                            />
                        )
                        }
                    </View>

                    <>
                        {this.state.message &&
                            <Text style={styles.message}>{this.state.message}</Text>
                        }
                    </>

                </View>

            </View>
        );

    }
}

const styles = StyleSheet.create
    ({

        searchText:
        {
            padding: 10,
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
        formSubtitle:
        {
            fontSize: 16,
            color: '#5A5A5A',
            fontWeight: 'bold',
            marginLeft: 5,
            padding: 10,
        },
        header:
        {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        headerCon:
        {
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
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
        button: {
            backgroundColor: '#CC0000',
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,

        },
        buttonText: {
            textAlign: "center",
            color: '#FFFFFF'

        },

    });