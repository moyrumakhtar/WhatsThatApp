import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import appHeader from '../images/header.jpg';
import { logOut } from "../request/logout"

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null, fName: "", sName: "",
            eMail: "", pWord: "",
        }
    }

    loadProfile = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ currentUser: data });
                console.log("LOADED PROFILE");
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

    editProfile = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const id = item.user_id;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify(
                    {
                        first_name: this.state.fName,
                        last_name: this.state.sName,
                        email: this.state.eMail,
                        password: this.state.pWord,
                    }
                ),
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ currentUser: data });
                console.log("UPDATED PROFILE");
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUES, LOG IN" });
            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
            else if (serverOutput.status === 403) {
                console.log("FORBIDDEN");
                this.setState({ message: "FORBIDDEN, UNABLE TO UPDATE" });
            }
            else if (serverOutput.status === 404) {
                console.log("INVALID USER");
                this.setState({ message: "INVALID, USER NOT FOUND" });
            }
            else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }

    }

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
    toEdit = () => {
        this.props.navigation.navigate("edit");
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
                                <Feather name="edit" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Setting </Text>
                            <TouchableOpacity
                               onPress={() => this.toEdit()}>
                                <Feather name="edit" size={25} color="#0f3d0f" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => this.logOutUser()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Logout </Text>
                        </View>
                    </TouchableOpacity>


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