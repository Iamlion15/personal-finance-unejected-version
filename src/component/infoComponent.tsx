import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Animated } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { router } from "expo-router";

type IncomeProps = {
    amount: string;
    description: string;
};

const { width } = Dimensions.get('window');

export default function InfoComponent({ amount, description }: IncomeProps) {
    const [activate, setActivate] = useState(false)
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const handleLongPress = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.timing(shakeAnim, {
                        toValue: -5,
                        duration: 50,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: 5,
                        duration: 50,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shakeAnim, {
                        toValue: 0,
                        duration: 50,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        onLongPress();
    };
    const onActivate = () => {
        setActivate(!activate)
    }
    const onLongPress = () => {
        console.log('Double tap!');
        router.push('/expenseModal')
    };

    return (
        <Animated.View
            className="px-1"
            style={[
                {
                    transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
                },
            ]}
        >
            <Pressable
                className="p-4 shadow-md justify-between"
                style={[styles.container, { backgroundColor: activate ? '#2548fb' : 'white' }]}
                android_ripple={{ color: '#d1d5db' }}
                onPress={onActivate}
                onLongPress={handleLongPress}
            >
                <View className="w-full items-start">
                    <FontAwesome name="tablet-screen-button" size={24} color={activate ? 'white' : 'black'} />
                </View>
                <Text adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.95} className={`${activate ? 'text-white' : 'text-gray-600'} text-base font-small mb-2`}>
                    {description}
                </Text>
                <Text
                    className={`${activate ? 'text-white' : 'text-gray-600'} text-xl font-bold`}
                    style={{ fontSize: 15 }}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                >
                    RWF {amount}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: 20,
    },
});
