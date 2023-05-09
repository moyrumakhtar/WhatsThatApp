import React, { Component, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/Fontisto";
import SettingsScreen from "./settingsscreen";

import appHeader from '../images/header.jpg';

export default class Editscreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fName: "", sName: "", eMail: "",
            message: "", pWord: "", profileReady: true,
            dfName: "", dsName: "", deMail: "",
            image: null,
        }

    }


    clearData = () => {
        this.setState({
            fName: this.state.dfName,
            sName: this.state.dsName,
            eMail: this.state.deMail,
            profileReady: true,
        });
    }

    toSetting = () => {
        this.props.navigation.navigate("settings");
    };

    cancelEdit = () => {
        this.clearData();
        console.log("CLEARED")
        this.props.navigation.navigate("settings");
    }

    loadProfile = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");
        console.log(current_id)

        this.setState({ message: " " })

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
                    fName: data.first_name,
                    sName: data.last_name,
                    eMail: data.email,
                    dfName: data.first_name,
                    dsName: data.last_name,
                    deMail: data.email,

                });
                console.log("LOAD PROFILE");

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

        }
    }

    editProfile = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user/${current_id}`, {
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
                this.toSetting();
                const data = await serverOutput.json();
                this.setState({ currentUser: data });
                SettingsScreen.setState({ profileReady: true });
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

        }
    }

    setProfilePicture = async (e) => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");
        
        const profileData = e.target.files[0]

        const res = await fetch(e.target.files[0].uri)
        const blob = await res.blob()

        try {
             fetch(`http://localhost:3333/api/1.0.0/user/${current_id}/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'image/png',
                    'X-Authorization': session_token,
                },
                body: blob,
            })   

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ currentUser: data });
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST" });
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

        }

    }

    validatePassword = async () => {
        const current_password = await AsyncStorage.getItem("current_password");

        if (this.state.pWord === current_password) {
            this.setState({ message: "" });
            console.log("VALID PASS")
            this.editProfile();

        }
        else {
            this.setState({ message: "INVALID PASSWORD" });
        }
    }

    handleFileInputChange = (e) => {
        this.setState({image: (e.target.files[0])});
        console.log(e.target.files[0])
       
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
                            <TouchableOpacity>
                                <Icon name="close" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Edit Profile </Text>
                            <TouchableOpacity>
                                <Icon name="close" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <Text style={styles.formText}> Profile Picture: </Text>

                    <View style={styles.image}>
                        <input id="imgs" type="file" accept="image/png, image/jpeg," onChange={this.setProfilePicture} />
                    </View>


                    <Text style={styles.formText}> First Name: </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ fName: text })}
                        defaultValue={this.state.dfName}
                        style={styles.input}
                    />
                    <Text style={styles.formText}> Last Name: </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ sName: text })}
                        defaultValue={this.state.dsName}
                        style={styles.input}
                    />
                    <Text style={styles.formText}> Email Address: </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ eMail: text })}
                        defaultValue={this.state.deMail}
                        style={styles.input}
                    />
                    <Text style={styles.formText}> Password: </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ pWord: text })}
                        placeholder="Password"
                        placeholderTextColor={"#C0C0C0"}
                        style={styles.input}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={() => this.validatePassword()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Submit </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.cancelEdit()}>
                        <View>
                            <Text style={styles.formLoginText}> Cancel </Text>
                        </View>
                    </TouchableOpacity>

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
        image:
        {
            alignItems: "center"
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

        },
        input:
        {
            borderBottomColor: '#14c83c',
            borderBottomWidth: 2,
            padding: 8,
            margin: 50,
            marginBottom: 10,
            marginTop: 5,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
            width: 300,

        },
        button:
        {
            backgroundColor: '#14c83c',
            padding: 8,
            paddingRight: 16,
            paddingLeft: 16,
            marginRight: 25,
            marginLeft: 25,
            bottom: 0,
            marginBottom: 10,
            marginTop: 20,

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
        textCon:
        {
            flex: 1,
            flexDirection: "row",

        },
    });