import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Pressable, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import validator from 'validator'
import LottieView from "lottie-react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get('window');
import ErrorMessageComponent from "@/src/component/loginErrorComponent";
import axios from "axios"
import { storeUserData } from "@/src/Utils/asyncStorageLoginDetails";

export default function LoginScreen() {
    type userLoggin = {
        email: string,
        password: string
    }
    type loginStateTypes = {
        email: boolean,
        password: boolean,
        loginButton: boolean
    }
    const router = useRouter();
    const [userDetails, setUserDetails] = useState<userLoggin>({
        email: "",
        password: ""
    })
    const [loginState, setLoginState] = useState<loginStateTypes>({
        email: false,
        password: false,
        loginButton: true
    })
    const [loginMessage, setLoginMessage] = useState('')
    const [loginError, setLoginError] = useState<userLoggin>({
        email: "",
        password: ""
    })
    const onPress = () => {
        router.push('/(auth)/register')
    }
    const onChangeEmail = (value: string) => {
        setUserDetails({ ...userDetails, email: value })
        if (!validator.isEmail(value)) {
            setLoginError({ ...loginError, email: "Provided email format is not valid" })
        }
        else {
            setLoginError({ ...loginError, email: "" })
        }
    }
    const onChangePassword = (value: string) => {
        setUserDetails({ ...userDetails, password: value })
        if (!validator.isLength(value, { min: 3 })) {
            setLoginError({ ...loginError, password: "password must be 3 characters in length" })
        }
        else {
            setLoginError({ ...loginError, password: "" })
        }
    }
    const onLoginUser = async () => {
        setLoginState({ email: true, password: true, loginButton: false })
        const apiUrl = process.env.EXPO_PUBLIC_API_URL
        console.log(apiUrl)
        try {
            const response = await axios.post(`${apiUrl}/user/api/v1/auth/login`, userDetails)
            setLoginState({ email: false, password: false, loginButton: true })
            console.log(response.data)
            if (response.data.status == 401) {
                console.log("password dont match")
            }
            else if (response.data.status == 200) {
                console.log("successfully logged in")
                storeUserData(response.data.token)
                router.push('/(tabs)/overview')
            }
            else {
                console.log("not found")
            }
        } catch (error: any) {
            console.log(error.message)
            setLoginState({ email: false, password: false, loginButton: true })
            setLoginMessage("An error occured")
        }
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="flex-1 bg-white">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center items-center px-6">
                        <LottieView
                            source={require('../../../assets/animations/auth.json')}
                            autoPlay
                            loop
                            style={styles.lottie}
                        />
                        <Text className="text-lg font-bold mb-4">Personal Finance</Text>
                        {loginError.email && <ErrorMessageComponent message={loginError.email} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <Fontisto name="email" size={20} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Email"
                                value={userDetails.email}
                                onChangeText={(text) => onChangeEmail(text)}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        {loginError.password && <ErrorMessageComponent message={loginError.password} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Password"
                                style={styles.input}
                                value={userDetails.password}
                                onChangeText={(text) => onChangePassword(text)}
                                keyboardType="visible-password"
                                autoCapitalize="none"
                            />
                        </View>
                        {loginMessage && <ErrorMessageComponent message={loginMessage} />}
                        {loginState.loginButton ? <Pressable
                            className="bg-blue-600 rounded-full py-3 items-center mt-6 mx-2 active:bg-blue-700"
                            style={styles.loginButton}
                            onPress={onLoginUser}
                        >
                            <Text className="text-white text-base font-semibold">Login</Text>
                        </Pressable>
                            :
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="border-2 border-blue-600 rounded-full py-1 px-9 flex-row items-center justify-center mx-2">
                                <LottieView
                                    source={require('../../../assets/animations/loading.json')} autoPlay loop style={{ width: 40, height: 40, marginRight: 10 }} />
                                <Text className="text-blue-600 font-semibold text-lg">Logging in ...</Text>
                            </TouchableOpacity>
                        }
                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-600">Don't have an account? </Text>
                            <Pressable onPress={onPress}>
                                <Text className="text-blue-600 font-semibold">Register here</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: width * 0.9,
        height: width * 0.9,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    loginButton: {
        width: width * 0.7
    }
});
