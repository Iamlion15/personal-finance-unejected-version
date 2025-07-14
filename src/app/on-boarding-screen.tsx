import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useRouter, Redirect } from "expo-router";
import { storeData } from "../Utils/asyncStorage";
import { useEffect } from "react";

const { width, height } = Dimensions.get('window')
export default function onBoardingScreen() {
    const router = useRouter();
    const handleDone = () => {
        router.push("/(auth)/login")
        storeData("onBoarded", "1")
    }
    const doneButton = ({ ...props }) => {
        return (<TouchableOpacity style={styles.doneButton} {...props}>
            <Text>Done</Text>
        </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Onboarding
                containerStyles={{ paddingHorizontal: 15 }}
                bottomBarHighlight={false}
                onSkip={handleDone}
                onDone={handleDone}
                DoneButtonComponent={doneButton}
                pages={[
                    {
                        backgroundColor: '#a7f3d8',
                        image: (
                            <LottieView
                                source={require('../../assets/animations/saving.json')}
                                autoPlay
                                loop
                                style={styles.lottie}
                            />
                        ),
                        title: 'Save Smarter',
                        subtitle: 'Start your journey to financial freedom. Our app helps you save consistently, track your progress, and build better habits.',
                    },
                    {
                        backgroundColor: '#fef3c7',
                        image: (<LottieView style={styles.lottie} source={require('../../assets/animations/income.json')} autoPlay loop />),
                        title: 'Organize Your Income',
                        subtitle: 'Easily categorize and monitor where your money goes. Gain control, reduce waste, and make informed spending decisions.',
                    },
                    {
                        backgroundColor: '#b0d9f3',
                        image: <LottieView style={styles.lottie} source={require('../../assets/animations/budget.json')} autoPlay loop />,
                        title: 'Plan with AI-Powered Budgets',
                        subtitle: 'Create personalized budgets with the help of AI. Stay on track with insights and recommendations tailored just for you.',
                    },
                ]}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"

    },
    lottie: {
        width: 400,
        height: 300
    },
    doneButton: {
        padding: 20,
        backgroundColor: "white",
        borderTopLeftRadius: "100%",
        borderBottomLeftRadius: "100%"
    }

})



