import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, KeyboardAvoidingView } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import appHeader from '../images/header.jpg';
export default class SingleChatScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pastMessages: [], message: "", chatReady: true, newName: "",
            chatName: "", newMessage: "", chatID: "", UpdateChat: false,
            addUser: false, newPID: "", user: ""
        };
    };

    async componentDidMount() {
        const user = await AsyncStorage.getItem('current_id');
        this.setState({user});
    }

    UpdateChatToggle = () => {
        this.setState(({ UpdateChat }) => ({ UpdateChat: !UpdateChat }));
        this.setState({ message: "" });

    }

    AddUserToggle = () => {
        this.setState(({ addUser }) => ({ addUser: !addUser }));
        this.setState({ message: "" });

    }

    getChat = async (limit = 25, offset = 0) => {
        const session_token = await AsyncStorage.getItem("session_token");
        const chatID = this.state.chatID;

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

    addUser = async () => {
        const session_token = await AsyncStorage.getItem("session_token");
        const newPID = this.state.newPID
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
                this.AddUserToggle();
                this.getChat();
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

    toChats = () => {
        this.props.navigation.navigate("chats");
    }

    messageItem = ({ item }) => {
        return (
            <Text> ... </Text>
        )
    }

    memberItem = ({ item }) => {
       if(item.user_id.toString() === this.state.user) {

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
                    <TouchableOpacity>
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
                <View>

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
                        {this.state.pastMessages.length > 0 ? (
                            <FlatList
                                data={this.state.pastMessages.messages}
                                renderItem={this.messageItem}
                            />
                        ) : (
                            <FlatList
                                data={this.state.pastMessages.messages}
                                ListEmptyComponent={<Text style={styles.formText}>No Messages</Text>}
                            />
                        )
                        }
                    </KeyboardAvoidingView>
                </View>

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
                                    style={styles.input}

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
                                    style={styles.input}
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

                <>
                    {this.state.message &&
                        <Text style={styles.message}>{this.state.message}</Text>
                    }
                </>

            </View>


        )

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
        headerSub:
        {
            flex: 1,
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
            marginTop: 10,
            backgroundColor: "#ededed"
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
            color: 'black',
            marginTop: 0,
            margin: 40,
            marginBottom: 0,
            fontSize: 13,
            color: '#34633E',
            fontWeight: 'bold',
            alignSelf: "center",
        },
        container: {
            //height: 640,

        },
        input: 
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
        space: {
            padding: 10,
            paddingBottom: 10,
        },
        buttonText: {
            textAlign: "center",
            color: '#FFFFFF'

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
    });