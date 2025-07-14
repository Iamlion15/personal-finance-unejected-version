import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Pressable, TouchableOpacity, } from "react-native";
import LottieView from "lottie-react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from "axios"
import validator from "validator"
import { useState } from "react";
import ErrorMessageComponent from "@/src/component/loginErrorComponent";
import SignupModal from "@/src/component/signupModal";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
    type userRegister = {
        FullName: string,
        email: string,
        nID: string,
        password: string
    }
    type registerStateTypes = {
        FullName: boolean,
        email: boolean,
        nID: boolean,
        password: boolean,
        registerButton: boolean
    }
    type registerErrorTypes = {
        FullName: string,
        email: string,
        nID: string,
        password: string
    }
    const [userDetails, setUserDetails] = useState<userRegister>({
        FullName: "",
        email: "",
        nID: "",
        password: ""
    })
    const [registerState, setRegisterState] = useState<registerStateTypes>({
        FullName: false,
        email: false,
        nID: false,
        password: false,
        registerButton: true
    })
    const [registerError, setRegisterError] = useState<registerErrorTypes>({
        FullName: "",
        email: "",
        nID: "",
        password: ""
    })
    const [registerMessage, setRegisterMessage] = useState('')
    const [showSuccess,setShowSuccess]=useState(false)
    const handleFullNameChange = (text: string) => {
        setUserDetails(prev => ({ ...prev, FullName: text }));
        setRegisterError(prev => ({ ...prev, FullName: text.trim().length >= 3 ? "" : "Full Name must be at least 3 characters", }));
    };

    const handleEmailChange = (text: string) => {
        setUserDetails(prev => ({ ...prev, email: text }));
        setRegisterError(prev => ({ ...prev, email: validator.isEmail(text) ? "" : "Provided email format is not valid", }));
    };

    const handlenIDChange = (text: string) => {
        setUserDetails(prev => ({ ...prev, nID: text }));
        setRegisterError(prev => ({
            ...prev, nID: text.length >= 5 ? "" : "National ID must be at least 5 characters",
        }));
    };

    const handlePasswordChange = (text: string) => {
        setUserDetails(prev => ({ ...prev, password: text }));
        setRegisterError(prev => ({
            ...prev, password: text.length >= 3 ? "" : "Password must be at least 3 characters",
        }));
    };

    const onRegisterUser = async () => {
        if (
            !userDetails.FullName.trim() ||
            !validator.isEmail(userDetails.email) ||
            !validator.isLength(userDetails.nID, { min: 5 }) ||
            !validator.isLength(userDetails.password, { min: 3 })) {
            setRegisterMessage("Please fill all fields correctly");
            return;
        }
        setRegisterState({ FullName: true, email: true, nID: true, password: true, registerButton: false });
        try {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/user/api/v1/auth/signup`, userDetails);
            setRegisterState({ FullName: false, email: false, nID: false, password: false, registerButton: true });
            setShowSuccess(true)
        } catch (error: any) {
            console.log(error)
            setRegisterState({ FullName: false, email: false, nID: false, password: false, registerButton: true });
            setRegisterMessage("Registration failed. Please try again.");
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
                        <Text className="text-lg font-bold mb-1">Personal Finance</Text>
                        {registerError.FullName && <ErrorMessageComponent message={registerError.FullName} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <FontAwesome6 name="person" size={24} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Full name"
                                style={styles.input}
                                value={userDetails.FullName}
                                onChangeText={handleFullNameChange}
                                keyboardType="ascii-capable"
                                autoCapitalize="none"
                            />
                        </View>
                        {registerError.email && <ErrorMessageComponent message={registerError.email} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <Fontisto name="email" size={20} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Email"
                                style={styles.input}
                                keyboardType="email-address"
                                value={userDetails.email}
                                onChangeText={handleEmailChange}
                                autoCapitalize="none"
                            />
                        </View>
                        {registerError.nID && <ErrorMessageComponent message={registerError.nID} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <MaterialIcons name="perm-identity" size={24} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="National Identity"
                                style={styles.input}
                                keyboardType="decimal-pad"
                                value={userDetails.nID}
                                onChangeText={handlenIDChange}
                                autoCapitalize="none"
                            />
                        </View>
                        {registerError.password && <ErrorMessageComponent message={registerError.password} />}
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2 mb-4 bg-white w-full">
                            <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={{ marginRight: 10 }} />
                            <TextInput
                                placeholder="Password"
                                style={styles.input}
                                keyboardType="visible-password"
                                value={userDetails.password}
                                onChangeText={handlePasswordChange}
                                autoCapitalize="none"
                            />
                        </View>
                        {registerMessage && <ErrorMessageComponent message={registerMessage} />}
                        {registerState.registerButton ? <Pressable className="bg-blue-600 rounded-full py-3 items-center mt-6 mx-2 active:bg-blue-700"
                            style={styles.loginButton}
                            onPress={onRegisterUser}
                        >
                            <Text className="text-white text-base font-semibold">Sign up</Text>
                        </Pressable>
                            :
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="border-2 border-blue-600 rounded-full py-1 px-9 flex-row items-center justify-center mx-2">
                                <LottieView
                                    source={require('../../../assets/animations/loading.json')} autoPlay loop style={{ width: 40, height: 40, marginRight: 10 }} />
                                <Text className="text-blue-600 font-semibold text-lg">Please wait ...</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            <SignupModal visible={showSuccess} onLogin={()=>router.push("/(auth)/login")} onNotNow={()=>{setShowSuccess(false)}}/>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: width * 0.9,
        height: width * 0.5,
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
