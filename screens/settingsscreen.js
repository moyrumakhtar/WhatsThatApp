import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";

import AsyncStorage from '@react-native-async-storage/async-storage';


import appHeader from '../images/header.jpg';
import { logOut } from "../request/logout"

export default class SettingsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null, fName: "", sName: "",
            eMail: "", pWord: "", profileReady: true, fullName: "",
            image: null
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.loadProfile();
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    loadProfile = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");
 
        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${current_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({
                    currentUser: data,
                    fName: data.first_name,
                    lName: data.last_name,
                    eMail: data.email,
                    fullName: data.first_name + " " + data.last_name
                });
                console.log("LOADED PROFILE");

                this.getPicture()
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

    getPicture = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${current_id}/photo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'image/png',
                    'X-Authorization': session_token,
                }
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.blob();

                this.setState({
                    image: URL.createObjectURL(data),
                });

                console.log("LOADED PICTURE");

            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });
            }
            else if (serverOutput.status === 404) {
                console.log("NOT FOUND");
                this.setState({ message: "NOT FOUND, LOG IN" });
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
                await AsyncStorage.removeItem("session_token")
                await AsyncStorage.removeItem("current_id");
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
        this.setState({ profileReady: true });
        this.props.navigation.navigate("edit");
    };

   

    render() {
        
        if (this.state.profileReady === true) {
            this.loadProfile();
            this.setState({ profileReady: false });
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
                                onPress={() => this.loadProfile()}>
                                <Feather name="refresh-ccw" size={25} color="#0f3d0f" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Setting </Text>
                            <TouchableOpacity
                                onPress={() => this.toEdit()}>
                                <Feather name="edit" size={25} color="#0f3d0f" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.formText}> Profile Picture: </Text>
                    <img id="PP" src={this.state.image} style={{alignSelf: "center", margin:20}}/>
                    
                    <Text style={styles.formText}> Name: </Text>
                    <Text style={styles.input}> {this.state.fullName} </Text>
                    <Text style={styles.formText}> Email Address: </Text>
                    <Text style={styles.input}> {this.state.eMail} </Text>

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
            marginTop: 0,
            margin: 40,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
        },
        container:
        {

        },
        input:
        {
            borderBottomColor: '#C0C0C0',
            borderBottomWidth: 2,
            padding: 8,
            margin: 50,
            marginBottom: 10,
            marginTop: 5,
            fontSize: 13,
            color: '#C0C0C0',
            fontWeight: 'bold',
            width: 300,

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
    
    });