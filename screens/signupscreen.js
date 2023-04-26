import React, {Component} from "react";
import {View, Text, TextInput, TouchableOpacity} from "react-native";

export default class signupscreen extends Component 
{
    constructor(props) 
    {
        super(props);

        this.state = {
            id: "", fName: "", sName: "",
            eMail: "", pWord: "", message: ""
        }
        
    }

    signuprequest = async () => 
    {
        const datatosend = 
        {
            sendfName: this.state.fName,
            sendsName: this.state.sName,
            sendeMail: this.state.eMail,
            sendpWord: this.state.pWord
        };

        const nameRegex = new RegExp(/^[a-zA-Z]{2,40}$/);
        const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        const pwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\W)[A-Za-z\d\W]{8,}$/);

        if(!(this.state.fName))
        {
            this.setState ({ message: "ENTER FIRST NAME" })
        }
        else if(!(this.state.sName))
        {
            this.setState ({ message: "ENTER LAST NAME" })
        }
        else if(!(this.state.eMail))
        {
            this.setState ({ message: "ENTER EMAIL" })  
        }
        else if(!(this.state.pWord))
        {
            this.setState ({ message: "ENTER PASSWORD" })
        }
        else if(!(nameRegex.test(this.state.fName)||nameRegex.test(this.state.sName)))
        {
            this.setState({ message: "ENTER VALID NAME, NAME CANT CONTAIN SPECAIL CHARACTERS" })
        }
        else if(!(emailRegex.test(this.state.eMail)))
        {
            this.setState({ message: "ENTER VALID EMAIL" })
        }
        else if(!(pwordRegex.test(this.state.pWord)))
        {
            this.setState({ message: "ENTER STRONG PASSWORD: 1 UPPERCASE, 1 LOWERCASE, 1 NUMBER, 1 SPECIAL AND 8 CHARACTERS LONG" })
        }
        else
        {
            try 
            {
                const serverOuput = await fetch ('http://localhost:3333/api/1.0.0/user', {
                    method: 'POST',
                    headers:{ 
                                'Content-Type': 'application/json',
                            },
                    body: JSON.stringify(datatosend),          
                });

                if(serverOuput.status === 201)
                {
                    this.setState({ message: "USER CREATED SUCCESSFULLY" })
                    //nav to login
                }
                else if(serverOuput.status === 400)
                {
                    this.setState({ message: "EMAIL ALREADY REGISTORED" })
                    console.log("USER ALREADY EXIST", message)
                } 
                else 
                {
                    this.setState({ message: "ERROR WHEN CREATING USER" })
                }

            } 
            catch (message) 
            {
                this.setState({ message: "ERROR WHEN CREATING USER, TRY AGAIN" })
                console.log("UNABLE TO CREATE USER", message)
            }
        }
    }

    render() {
        return (
            <Text> FIRST NAME: </Text>
                
        )
    }
}