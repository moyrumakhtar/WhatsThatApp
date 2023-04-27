import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icon from "react-native-vector-icons/Fontisto";

import appHeader from '../images/header.jpg';

export default class Editscreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null, fName: "", sName: "", message: "",
            eMail: "", pWord: "", editReady: true, validPass: false,
            nWord: "", new: false
        }
    }

    toSetting = () => {
        this.props.navigation.navigate("settings");
    };

    loadProfile = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");
        console.log(current_id)
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
                    sName: data.last_name,
                    eMail: data.email,
                });
                console.log("EDIT PROFILE");

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

    editProfile = async () => {
        const current_id = await AsyncStorage.getItem("current_id");
        const session_token = await AsyncStorage.getItem("session_token");
        console.log(current_id)

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

        }
    }

    validatePassword = async () => {
        const current_password = await AsyncStorage.getItem("current_password");

        if (this.state.pWord === current_password) {
            this.setState({ validPass: true });
            this.setState({ message: "" });
            console.log("VALID PASS")
            this.editProfile();
            // if(this.state.new === true)
            // {
            //     this.newPasswordEntered();
            //     this.editProfile();
            // } 
            // else {
            //     this.setState({new: pWord})
            // }
            
        }
        else {
            this.setState({ message: "INVALID PASSWORD" });
        }
    }

    // newPasswordEntered = () => {
    //     const pwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\W)[A-Za-z\d\W]{8,}$/);
    //     if (!(pwordRegex.test(this.state.nWord))) {
    //         this.setState({ message: "ENTER STRONG PASSWORD: 1 UPPERCASE, 1 LOWERCASE, 1 NUMBER, 1 SPECIAL AND 8 CHARACTERS LONG" })
    //     }
    // }

    render() {

        if (this.state.editReady === true) {
            this.loadProfile();
            this.setState({ editReady: false });
        }

        const toggleChecked = () => this.setState({ new: true});

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


                    <Text style={styles.formText}> Profile Picture: </Text>
                    {/* insert picture display here */}

                    <Text style={styles.formText}> First Name: </Text>
                    <TextInput
                        onChangeText={fName => this.setState({ fName })}
                        defaultValue={this.state.fName}
                        style={styles.input}
                    />
                    <Text style={styles.formText}> Last Name: </Text>
                    <TextInput
                        onChangeText={sName => this.setState({ sName })}
                        defaultValue={this.state.sName}
                        style={styles.input}
                    />
                    <Text style={styles.formText}> Email Address: </Text>
                    <TextInput
                        onChangeText={eMail => this.setState({ eMail })}
                        defaultValue={this.state.eMail}
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
                    {/* <Text style={styles.formText}> New Password: </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ nWord: text })}
                        onChange={toggleChecked}
                        placeholder="New Password"
                        placeholderTextColor={"#C0C0C0"}
                        style={styles.input}
                        secureTextEntry
                    /> */}
                   
                    <TouchableOpacity onPress={() => this.validatePassword()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Submit </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toSetting()}>
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