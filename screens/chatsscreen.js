import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import appHeader from '../images/header.jpg';

export default class Chatsscreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [], AddChat: false, chatName: "",
            chatReady: true, UpdateChat: false, chatID: "", newName: "",

        }
    }

    AddChatToggle = () => {
        this.setState(({ AddChat }) => ({ AddChat: !AddChat }));
        this.setState({ message: "" });
    }

    UpdateChatToggle = () => {
        this.setState(({ UpdateChat }) => ({ UpdateChat: !UpdateChat }));
        this.setState({ message: "" });
    }


    loadChats = async () => {
        const session_token = await AsyncStorage.getItem("session_token");

        try {
            const serverOutput = await fetch('http://localhost:3333/api/1.0.0/chat', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ chats: data });
                console.log("CHATS LOADED");
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

    startChat = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const name = this.state.chatName;

        try {
            const serverOutput = await fetch('http://localhost:3333/api/1.0.0/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ name }),
            });

            if (serverOutput.status === 201) {
                this.loadChats();
                this.AddChatToggle();
                console.log("CHAT CREATED");
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST" });

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

    editChat = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const name = this.state.newName;
        const id = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ name }),
            });

            if (serverOutput.status === 200) {
                this.loadChats();
                this.UpdateChatToggle();
                console.log("UPDATED CHAT");
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
                this.setState({ message: "FORBIDDEN, YOU CAN RENAME" });

            }
            else if (serverOutput.status === 404) {
                console.log("NOT FOUND");
                this.setState({ message: "NOT FOUND, CHAT DOESNT EXIST" });

            }
            else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }

    }

    chatItems = ({ item }) => {

        this.setState({chatID: item.chat_id});

        return (

            <View style={styles.chatItem}>
                <Text style={styles.chatText}>
                    {item.name}
                </Text>

                <View style={styles.buttonControl}>

                    <View style={styles.space}>
                        <TouchableOpacity onPress={() => this.UpdateChatToggle()} >
                            <Feather name="edit" size={15} color="#0f3d0f" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>


        );
    };

    validInput = () => {

        if (!(this.state.chatName)) {
            this.setState({ message: "ENTER CHAT NAME" });
        }
        else {
            this.startChat();
        }
    }
    validNewInput = () => {

        // if (!(this.state.newName)) {
        //     this.setState({ message: "ENTER CHAT NAME" });
        // }
        // else {
        //     this.editChat();
        // }
    }

    render() {
        if (this.state.chatReady === true) {
            this.loadChats();
            this.setState({ chatReady: false });
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
                                <Ionicons name="md-add-sharp" size={25} color="#f2f2f2" />
                            </TouchableOpacity>
                            <Text style={styles.formAppTitle}> Chats </Text>
                            <TouchableOpacity
                                onPress={() => this.AddChatToggle()}>
                                <Ionicons name="md-add-sharp" size={35} color="#14c83c" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.listBox}>
                        {this.state.chats.length > 0 ? (

                            <FlatList
                                data={this.state.chats}
                                renderItem={this.chatItems}
                                ListHeaderComponent={() => <Text style={styles.formSubtitle}> Chat List </Text>}
                                ListEmptyComponent={<Text style={styles.formText}>No Chats Found</Text>}
                            />

                        ) : (
                            <FlatList
                                data={this.state.chats}
                                renderItem={this.chatItems}
                                ListHeaderComponent={() => <Text style={styles.formSubtitle}> Chat List </Text>}
                                ListEmptyComponent={<Text style={styles.formText}>No Chats Found</Text>}
                            />
                        )
                        }
                    </View>

                </View>

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={this.state.AddChat}
                    onRequestClose={this.AddChatToggle}
                >
                    <View style={styles.modalCon}>
                        <View style={styles.modal}>

                            <View style={styles.header}>
                                <View style={styles.headerCon}>
                                    <Text style={styles.formAppTitleModal}> Create New Chat  </Text>
                                    <TouchableOpacity
                                        onPress={() => this.AddChatToggle()}>
                                        <Ionicons name="md-close-sharp" size={25} color="#CC0000" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View styles={styles.headerCon1}>
                                <TextInput
                                    defaultValue={""}
                                    id="chatValue"
                                    placeholder="Enter Chat Name"
                                    placeholderTextColor={"#C0C0C0"}
                                    onChangeText={(text) => this.setState({ chatName: text })}
                                    style={styles.input}

                                />

                                <TouchableOpacity
                                    onPress={() => this.validInput()}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}> Create </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </Modal>

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={this.state.UpdateChat}
                    onRequestClose={this.UpdateChatToggle}
                >
                    
                </Modal>

                <>
                    {this.state.message &&
                        <Text style={styles.message}>{this.state.message}</Text>
                    }
                </>

            </View>
        );
    }

}

const styles = StyleSheet.create
    ({
        formSubtitle:
        {
            fontSize: 16,
            color: '#5A5A5A',
            fontWeight: 'bold',
            marginLeft: 5,
            padding: 10,
        },
        headerCon1:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center",
            borderBottomColor: '#34633E',
            borderBottomWidth: 2,

        },
        modalCon:
        {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modal:
        {
            backgroundColor: "#f2f2f2",
            padding: 20,
            shadowColor: "#0f3d0f",
            shadowOffset: {
                height: 1,
                width: 0
            },
            shadowRadius: 2,
            shadowOpacity: 0.40,

        },
        header:
        {
            alignItems: "center"
        },
        headerCon:
        {
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        formAppTitleModal:
        {
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            fontSize: 16,
            color: '#34633E',
            fontWeight: 'bold',
            marginBottom: 10,
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
        container: {
            //height: 640,

        },
        input: {
            borderBottomColor: '#14c83c',
            borderBottomWidth: 2,
            padding: 8,
            margin: 30,
            marginBottom: 20,
            marginTop: 10,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',


        },
        button: {
            backgroundColor: '#14c83c',
            margin: 40,
            marginTop: 0,
            marginBottom: 10,
            padding: 10,
            paddingBottom: 10,


        },
        space: {
            padding: 10,
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
            alignSelf: "center",
            alignItems: "flex-end"
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
        chatText:
        {
            padding: 5,
            color: 'black',
            marginTop: 5,
            margin: 20,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
        },
        chatItem:
        {
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center"
        },
    });