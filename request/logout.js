import AsyncStorage from '@react-native-async-storage/async-storage';

export const logOut = async () => {
    const sessiontoken = await AsyncStorage.getItem('session_token');

    try {
        const serverOutput = await fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': sessiontoken,
            },
        });

        if (serverOutput.status === 200) {
            console.log("LOGGED OUT")
            return true;

        } else if (serverOutput.status === 401) {
            console.log("UNAUTHORISED");
            throw new Error("UNAUTHORISED, CAN'T LOG OUT");

        } else {
            console.log("SERVER ERROR");
            throw new Error("UNAUTHORISED, CAN'T LOG OUT");

        }
    } catch (message) {
        console.error("ERROR:", message);

    }
};