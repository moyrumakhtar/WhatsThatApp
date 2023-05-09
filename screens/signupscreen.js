import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import logo from '../images/logo.jpg';

export default class SignUpscreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "", fName: "", sName: "",
            eMail: "", pWord: "", message: ""
        }
    }

    signuprequest = async () => {
        this.setState({ sent: true })
        this.setState({ message: "" })

        const nameRegex = new RegExp(/^[a-zA-Z]{2,40}$/);
        const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        const pwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\W)[A-Za-z\d\W]{8,}$/);

        if (!(this.state.fName)) {
            this.setState({ message: "ENTER FIRST NAME" })
        }
        else if (!(this.state.sName)) {
            this.setState({ message: "ENTER LAST NAME" })
        }
        else if (!(this.state.eMail)) {
            this.setState({ message: "ENTER EMAIL" })
        }
        else if (!(this.state.pWord)) {
            this.setState({ message: "ENTER PASSWORD" })
        }
        else if (!(nameRegex.test(this.state.fName) || nameRegex.test(this.state.sName))) {
            this.setState({ message: "ENTER VALID NAME, NAME CANT CONTAIN SPECAIL CHARACTERS" })
        }
        else if (!(emailRegex.test(this.state.eMail))) {
            this.setState({ message: "ENTER VALID EMAIL" })
        }
        else if (!(pwordRegex.test(this.state.pWord))) {
            this.setState({ message: "ENTER STRONG PASSWORD: 1 UPPERCASE, 1 LOWERCASE, 1 NUMBER, 1 SPECIAL AND 8 CHARACTERS LONG" })
        }
        else {
            try {
                const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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

                if (serverOutput.status === 201) {
                    const data = await serverOutput.json();
                    console.log("USER CREATED SUCCESSFULLY");
                    this.setState({ id: data.user_id });
                    this.props.navigation.navigate("login");
                }
                else if (serverOutput.status === 400) {
                    console.log("EMAIL ALREADY REGISTORED");
                    this.setState({ message: "EMAIL ALREADY REGISTORED" });
                }
                else {
                    console.log("ERROR WHEN CREATING USER");
                    this.setState({ message: "ERROR WHEN CREATING USER, TRY AGAIN" });
                }
            } catch (message) {
                console.error("ERROR:", message);
            }
        }


    }

    tologin = () => {
        this.props.navigation.navigate('login');
    }

    render() {
        return (
            <View>

                <img
                    id="signupLogo"
                    src={logo} className="signupLogo"
                />

                <View style={styles.container}>

                    <View style={styles.container}>

                        <View style={styles.container}>
                            <Text style={styles.formTitle}> Create a New Account </Text>
                            <Text style={styles.formText}> First Name </Text>
                            <TextInput
                                id="fName"
                                placeholder="First"
                                placeholderTextColor={"#C0C0C0"}
                                onChangeText={fName => this.setState({ fName })}
                                defaultValue={this.state.fName}
                                style={styles.input}
                            />


                            <Text style={styles.formText}> Last Name </Text>
                            <TextInput
                                placeholder="Last"
                                placeholderTextColor={"#C0C0C0"}
                                onChangeText={sName => this.setState({ sName })}
                                defaultValue={this.state.sName}
                                style={styles.input}
                            />

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

                            <TouchableOpacity onPress={this.signuprequest}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.tologin}>
                                <View>
                                    <Text style={styles.formLoginText}>Already have an account? Login Here</Text>
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