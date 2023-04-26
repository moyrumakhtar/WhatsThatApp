import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../images/logo.jpg';

export default class LogInscreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            eMail: "", pWord: "", message: "",
            id: ""
        }
        this.loginrequest = this.loginrequest.bind(this)

    }

    loginrequest = async () => {
        this.setState({ sent: true })
        this.setState({ message: "" })

        const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        if (!(this.state.eMail)) {
            this.setState({ message: "ENTER EMAIL" })
            return;
        }
        else if (!(this.state.pWord)) {
            this.setState({ message: "ENTER PASSWORD" })
            return;
        }
        else if (!(emailRegex.test(this.state.eMail))) {
            this.setState({ message: "ENTER VALID EMAIL" })
            return;
        }

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        email: this.state.eMail,
                        password: this.state.pWord,
                    }
                ),
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                console.log("LOGIN SUCCESSFULLY");
                const session_token = data.token;
                this.setState({ id: data.user_id });

                if (!session_token) {
                    console.log("SESSION TOKEN NOT FOUND");
                    this.setState({ message: "ERROR OCCURRED, TRY AGAIN" });
                }
                else {
                    try {
                        await AsyncStorage.setItem('session_token', session);
                        await AsyncStorage.setItem('user_id', this.state.id.toString());
                    } catch (message) {

                        this.setState({ message: "ERROR OCCURRED WHEN SAVING TOKEN" });
                        return;
                    }
                    this.props.navigation.navigate("home");
                }

            }
            else if (serverOutput.status === 400) {
                console.log("INVALID LOGIN DETAILS");
                this.setState({ message: "INVALID EMAIL OR PASSWORD" });

            }
            else {
                console.log("ERROR WHEN LOGGING IN");
                this.setState({ message: "ERROR WHEN LOGGING IN" });
            }

        } catch (message) {
            console.error("ERROR:", message);
        }
    }

    render() {
        return (
            <View>

                <img
                    id="loginLogo"
                    src={logo} className="loginLogo"
                />

                <View style={styles.container}>

                    <View style={styles.container}>

                        <View style={styles.container}>
                            <Text style={styles.formTitle}> Login to Your Account </Text>


                            <Text style={styles.formText}> Email Address </Text>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={"#C0C0C0"}
                                onChangeText={eMail => this.setState({ eMail })}
                                defaultValue={this.state.eMail}
                                style={styles.input}
                            />

                            <Text style={styles.formText}> Password </Text>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={"#C0C0C0"}
                                onChangeText={pWord => this.setState({ pWord })}
                                defaultValue={this.state.pWord}
                                style={styles.input}
                                secureTextEntry
                            />

                            <TouchableOpacity onPress={this.loginrequest}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Login </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.tosignup}>
                                <View>
                                    <Text style={styles.formLoginText}> Don't have an account? Create Here </Text>
                                </View>
                            </TouchableOpacity>

                            <>
                                {this.state.message &&
                                    <Text style={styles.message}>{this.state.message}</Text>
                                }
                            </>

                        </View>

                    </View>
                </View>
            </View>
        );
    }

    tosignup = () => {
        this.props.navigation.navigate("signup");
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