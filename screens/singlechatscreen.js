import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, KeyboardAvoidingView } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import appHeader from '../images/header.jpg';
export default class SingleChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pastMessages: [], message: " ", chatReady: true, newName: "",
            chatName: "", newMessage: "", chatID: "", UpdateChat: false,
            addUser: false, user: "", newPID: "",
            editMessage: "", edit: false, editMessageID: "", oldMessage: ""
        };
    };

    UpdateChatToggle = () => {
        this.setState(({ UpdateChat }) => ({ UpdateChat: !UpdateChat }));
        this.setState({ message: " " });
    }

    EditMessageToggle = () => {
        this.setState(({ edit }) => ({ edit: !edit }));
        this.setState({ message: " " });
    }

    AddUserToggle = () => {
        this.setState(({ addUser }) => ({ addUser: !addUser }));
        this.setState({ message: " " });

    }

    getChat = async (limit = 25, offset = 0) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const chatID = this.state.chatID;

        const user = await AsyncStorage.getItem('current_id');
        this.setState({ user });

        try {
            const serverOutput = await fetch(
                `http://localhost:3333/api/1.0.0/chat/${chatID}?limit=${limit}&offset=${offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': session_token,
                    },
                }
            );

            if (serverOutput.status === 200) {
                const data = await serverOutput.json();
                this.setState({ pastMessages: data });
                console.log("MESSAGES LOADED")
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

    editChat = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const name = this.state.newName;
        const chatID = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ name }),
            });

            if (serverOutput.status === 200) {
                this.setState({ chatName: name })
                this.setState({ message: "UPDATED CHAT" });
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

    addUser = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const newPID = this.state.newPID;
        const chatID = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${newPID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                this.getChat();
                this.setState({ message: "USER ADDED" });
                console.log("USER ADDED")
            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST" });

            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });

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

    removeUser = async (item) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const newPID = item.user_id;
        const chatID = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${newPID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                this.getChat();
                this.setState({ message: "USER REMOVED" });
                console.log("USER REMOVED")

            }
            else if (serverOutput.status === 400) {
                console.log("BAD REQUEST");
                this.setState({ message: "BAD REQUEST" });

            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });

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

    sendChat = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const message = this.state.newMessage;
        const chatID = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ message }),
            });

            if (serverOutput.status === 200) {
                this.getChat();
                this.setState({ message: " " });
                console.log("MESSAGE SENT")
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
                this.setState({ message: "FORBIDDEN, YOU CANT SEND MESSAGE" });

            }
            else {
                console.log("SERVER ERROR");
                this.setState({ message: "SERVER ERROR, TRY AGAIN" });
            }
        } catch (message) {
            console.error("ERROR:", message);
        }

    }

    deleteMessage = async (messageID) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const chatID = this.state.chatID;

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
            });

            if (serverOutput.status === 200) {
                this.getChat();
                console.log("MESSAGE DELETED")
                this.setState({ message: "MESSAGE DELETED" });
                
            }
            else if (serverOutput.status === 401) {
                console.log("UNAUTHORISED");
                this.setState({ message: "UNAUTHORISED, LOG IN" });

            }
            else if (serverOutput.status === 403) {
                console.log("FORBIDDEN");
                this.setState({ message: "FORBIDDEN, YOU CANT SEND MESSAGE" });

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
    
    editMessage = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const chatID = this.state.chatID;
        const message = this.state.editMessage;
        const messageID = this.state.editMessageID

        try {
            const serverOutput = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': session_token,
                },
                body: JSON.stringify({ message }),
            });

            if (serverOutput.status === 200) {
                this.getChat();
                console.log("MESSAGE DELETED")
                this.setState({ message: "MESSAGE UPDATED" });
                
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
                this.setState({ message: "FORBIDDEN, YOU CANT SEND MESSAGE" });

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

    validNewInput = () => {

        if (!(this.state.newName)) {
            this.setState({ message: "ENTER CHAT NAME" });
        }
        else {
            this.editChat();
        }
    }

    validUserInput = () => {

        if (!(this.state.newPID)) {
            this.setState({ message: "ENTER USER ID" });
        }
        else {
            this.addUser();
        }
    }

    validMessageInput = () => {

        if (!(this.state.newMessage)) {
            this.setState({ message: "ENTER MESSAGE" });
        }
        else {
            this.sendChat();
        }
    }

    validMessageEdit = () => {

        if (!(this.state.editMessage)) {
            this.setState({ message: "ENTER MESSAGE" });
        }
        else {
            this.editMessage();
        }
    }


    toChats = () => {
        this.props.navigation.navigate("chats");
    }

    messageItem = ({ item }) => {

        if (item.author.user_id.toString() === this.state.user) {

            return (
                <View style={styles.myMessaageIcon}>

                    <View style={styles.myMessage}>
                        <View style={styles.myMessageHeader}>
                            <Text style={styles.nameText}>Me</Text>
                            <Text style={styles.myMessageText}>{item.message}</Text>
                        </View>
                    </View>

                    <View style={styles.iconStuff}>
                        <View style={styles.icon1}>
                            <TouchableOpacity  onPress={() => {
                                    this.setState({
                                        editMessageID: item.message_id,
                                        edit: true,
                                        oldMessage: item.message

                                    })
                                }}>
                                <MaterialIcons name="edit" size={15} color="#a2a2a2" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.icon2}>
                            <TouchableOpacity onPress={() => this.deleteMessage(item.message_id)}>
                                <Ionicons name="md-trash-bin" size={15} color="#a2a2a2" />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            );
        }
        else {
            return (

                
                <View style={styles.otherMessage}>
                    <View style={styles.otherMessageHeader}>
                        <Text style={styles.nameText}> {item.author.first_name}</Text>
                        <Text style={styles.otherMessageText}>{item.message}</Text>
                    </View>
                </View>
            );

        }
    }

    memberItem = ({ item }) => {
        if (item.user_id.toString() === this.state.user) {

            return (

                <View style={styles.searchItems}>

                    <Text style={styles.searchTextC}>
                        {item.first_name} {item.last_name}
                    </Text>
                    <View style={styles.space}>
                        <TouchableOpacity>
                            <Ionicons name="person-remove" size={15} color="#f2f2f2" />
                        </TouchableOpacity>
                    </View>


                </View>
            );
        }
        else {
            return (

                <View style={styles.searchItems}>

                    <Text style={styles.searchText}>
                        {item.first_name} {item.last_name}
                    </Text>
                    <View style={styles.space}>
                        <TouchableOpacity
                            onPress={() => this.removeUser(item)}>
                            <Ionicons name="person-remove" size={15} color="#0f3d0f" />
                        </TouchableOpacity>
                    </View>


                </View>
            );

        }
    }

    render() {

        if (this.state.chatReady === true) {
            this.getChat();
            this.setState({ chatReady: false });

            const { chatName } = this.props.route.params;
            this.setState({ chatName: chatName });

            const { chatID } = this.props.route.params;
            this.setState({ chatID: chatID });
        }

        return (

            <View>
                <img
                    id="appHeader"
                    src={appHeader} className="appHeader"
                />
                <View style={styles.container}>
                    <View style={{ justifyContent: 'space-around' }}>


                        <View style={styles.header}>
                            <View style={styles.headerCon}>
                                <TouchableOpacity>
                                    <Ionicons name="md-close-sharp" size={34} color="#e0e0e0" />
                                </TouchableOpacity>
                                <Text style={styles.formAppTitle}> {this.state.chatName} </Text>
                                <TouchableOpacity onPress={() => this.toChats()}>
                                    <Ionicons name="md-close-sharp" size={34} color="#CC0000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.headerSub}>
                            <View style={styles.headerConSub}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        UpdateChat: true
                                    })
                                }}>
                                    <Feather name="edit" size={20} color="#0f3d0f" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        addUser: true
                                    })
                                }}>
                                    <Ionicons name="md-person-add" size={20} color="#14c83c" />
                                </TouchableOpacity>

                            </View>
                        </View>

                        <KeyboardAvoidingView>
                            <View style={styles.message}>
                                <FlatList
                                    data={this.state.pastMessages.messages}
                                    ListEmptyComponent={<Text style={styles.formText}>No Messages</Text>}
                                    style={styles.flat}
                                    inverted
                                    renderItem={this.messageItem}
                                />
                                <>
                                    {this.state.message &&
                                        <Text style={styles.message1}>{this.state.message}</Text>
                                    }
                                </>
                            </View>
                            <View style={styles.bottom}>
                                <View style={styles.messageInput}>
                                    <TextInput
                                        id="message"
                                        placeholder="Enter Message"
                                        placeholderTextColor={"#C0C0C0"}
                                        value={this.state.newMessage}
                                        onChangeText={(text) => this.setState({ newMessage: text })}
                                        style={styles.input}
                                    />

                                    <TouchableOpacity onPress={() => this.validMessageInput()}>
                                        <Ionicons name="send" size={25} color="#0f3d0f" />
                                    </TouchableOpacity>

                                </View>
                            </View>


                        </KeyboardAvoidingView>
                    </View>
                </View>

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={this.state.edit}
                    onRequestClose={this.EditMessageToggle}>

                    <View style={styles.modalCon}>
                        <View style={styles.modal}>

                            <View style={styles.header}>
                                <View style={styles.headerConModal}>
                                    <Text style={styles.formAppTitleModal}>Edit Message</Text>
                                    <TouchableOpacity
                                        onPress={() => this.EditMessageToggle()}>
                                        <Ionicons name="md-close-sharp" size={25} color="#CC0000" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View styles={styles.headerCon1}>
                                <TextInput
                                    defaultValue={this.state.oldMessage}
                                    id="chatNewValue"
                                    placeholder="Enter New Message"
                                    placeholderTextColor={"#C0C0C0"}
                                    onChangeText={(text) => this.setState({ editMessage: text })}
                                    style={styles.input1}

                                />

                                <TouchableOpacity
                                    onPress={() => this.validMessageEdit()}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}> Update </Text>
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
                    onRequestClose={this.UpdateChatToggle}>

                    <View style={styles.modalCon}>
                        <View style={styles.modal}>

                            <View style={styles.header}>
                                <View style={styles.headerConModal}>
                                    <Text style={styles.formAppTitleModal}>Update Chat Name</Text>
                                    <TouchableOpacity
                                        onPress={() => this.UpdateChatToggle()}>
                                        <Ionicons name="md-close-sharp" size={25} color="#CC0000" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View styles={styles.headerCon1}>
                                <TextInput
                                    defaultValue={""}
                                    id="chatNewValue"
                                    placeholder="Enter New Name"
                                    placeholderTextColor={"#C0C0C0"}
                                    onChangeText={(text) => this.setState({ newName: text })}
                                    style={styles.input1}

                                />

                                <TouchableOpacity
                                    onPress={() => this.validNewInput()}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}> Update </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                

                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={this.state.addUser}
                    onRequestClose={this.AddUserToggle}>

                    <View style={styles.modalCon}>
                        <View style={styles.modal}>

                            <View style={styles.header}>
                                <View style={styles.headerConModal}>
                                    <Text style={styles.formAppTitleModal}>Participants</Text>
                                    <TouchableOpacity
                                        onPress={() => this.AddUserToggle()}>
                                        <Ionicons name="md-close-sharp" size={25} color="#CC0000" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.padd}>
                                <FlatList
                                    data={this.state.pastMessages.members}
                                    renderItem={this.memberItem}
                                />
                            </View>

                            <View styles={styles.headerCon1}>
                                <TextInput
                                    defaultValue={""}
                                    id="userIDChat"
                                    placeholder="Enter User ID"
                                    placeholderTextColor={"#C0C0C0"}
                                    onChangeText={(text) => this.setState({ newPID: text })}
                                    style={styles.input1}
                                />
                                <TouchableOpacity
                                    onPress={() => this.validUserInput()}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}> Add </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>

            </View>


        )

    }

}

const styles = StyleSheet.create
    ({
        icon1: 
        {
            padding: 4,
            marginLeft: 4,
        },
        icon2: 
        {
            padding: 4,
            marginLeft: 4,
        },
        iconStuff:
        {
            flexDirection: "row",
            paddingRight: 5,
        },
        myMessaageIcon:
        {
            alignItems: "flex-end",
            marginRight: 10,
            marginLeft: 10,
            marginTop: 5,
        },
        nameText:
        {
            color: '#a2a2a2',
            fontWeight: 'bold',
            padding: 3,

        },
        myMessage:
        {
            flexDirection: "row",
            justifyContent: 'flex-end',
            marginTop: 5,
            padding: 2,
        },
        myMessageText:
        {
            backgroundColor: '#14c83c',
            padding: 10,
            borderRadius: 10,
            borderColor: '#14c83c',
            marginTop: 0,
            marginBottom: 0,
            fontSize: 13,
            color: '#FFFFFF',
            fontWeight: 'bold',
            alignSelf: "center",
        },
        otherMessage:
        {
            flexDirection: "row",
            justifyContent: 'flex-start',
            marginTop: 5,
            padding: 2,
        },
        otherMessageText:
        {
            backgroundColor: '#e0e0e0',
            padding: 10,
            borderRadius: 10,
            borderColor: '#e0e0e0',
            marginTop: 0,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
            alignSelf: "center",
        },
        flat: {
            height: 438,
        },
        formSubtitle:
        {
            fontSize: 16,
            color: '#5A5A5A',
            fontWeight: 'bold',
            marginLeft: 5,
            padding: 10,
        },
        headerSub:
        {
            alignItems: "center",

        },
        headerConSub:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            paddingRight: 35,
            paddingLeft: 35,
            backgroundColor: "#ededed"
        },
        header:
        {
            alignItems: "center",
        },
        otherMessageHeader:
        {
            alignItems: "flex-start",
            marginLeft: 10,
            marginRight: 10,
        },
        myMessageHeader:
        {
            alignItems: "flex-end",
        },
        headerCon:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "#e0e0e0"

        },
        headerConModal:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",

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

        formText:
        {
            padding: 5,
            marginTop: 0,
            margin: 40,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
            alignSelf: "center",
        },
        container:
        {

        },
        messageInput:
        {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            backgroundColor: "#ededed",
            padding: 5,
            borderBottomColor: '#14c83c',
            borderBottomWidth: 2,

        },
        input:
        {
            padding: 5,
            paddingRight: 140,
            marginTop: 10,
            marginBottom: 10,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',

        },
        input1:
        {
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
        button:
        {
            backgroundColor: '#14c83c',
            margin: 40,
            marginTop: 0,
            marginBottom: 10,
            padding: 10,
            paddingBottom: 10,


        },
        space:
        {
            padding: 10,
            paddingBottom: 10,
        },
        buttonText: {
            textAlign: "center",
            color: '#FFFFFF'

        },
        message:
        {
            color: '#CC0000',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold',
            margin: 10,
        },
        message1:
        {
            color: '#CC0000',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 'bold',
            margin: 10,
            alignSelf: "center",
            alignItems: "flex-end"
        },
        searchText:
        {
            padding: 5,
            margin: 20,
            marginBottom: 0,
            marginTop: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
        },
        searchTextC:
        {
            padding: 5,
            margin: 20,
            marginBottom: 0,
            marginTop: 0,
            fontSize: 13,
            color: '#14c83c',
            fontWeight: 'bold',
        },
        searchItems:
        {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 5,
        },
        padd:
        {
            marginTop: 10,
            marginBottom: 10,
        },
        bottom:
        {

        },
    });