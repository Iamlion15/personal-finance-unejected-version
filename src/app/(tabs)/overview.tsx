import { StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import OverviewHeader from "@/src/component/overViewHeader";
import LatestEntries from "@/src/component/latestEntryComponent";
import { useRef, useState,useEffect } from "react";
import AddExpensesModal from "@/src/component/addExpensesModal";
import SuccessModal from "@/src/component/successModal";
import { router } from "expo-router";
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setOverview } from "@/src/redux/slices/dashboardSlice";


export default function Overview() {
    const [modalVisible, setModalVisible] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const successModalOpen = () => {
        setShowSuccessModal(true);
    };
    const onContinue = () => {
        setShowSuccessModal(false);
    }
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
    const onLongPress = () => {
        console.log('Double tap!');
        router.push('/expenseModal')
    };
    const data = useSelector((state: RootState) => state.overview.overviews);
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchExpenses = async () => {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL
            try {
                const token = await getUserData();
                const config = {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                };
                const response = await axios.get(`${apiUrl}/trans/api/v1/dashboard/overview`, config);
                dispatch(setOverview(response.data.overview));
            } catch (error) {
                console.error('Failed to fetch goals:', error);
            }
        };

        fetchExpenses();
    }, [dispatch]);
    return (
        <View style={styles.container}>
            <View>
                <OverviewHeader />
            </View>
            <View className="py-4" style={styles.topContainer}>
                <View className="mb-0 ml-3 mr-3 flex-row justify-between">
                    <Text className="text-black-800 text-lg font-medium">Latest entries</Text>
                    <Animated.View
                        className="px-1"
                        style={[
                            {
                                transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
                            },
                        ]}
                    >
                        <TouchableOpacity className="border border-blue-500 rounded-xl px-4 py-2" onPress={() => setModalVisible(true)} onLongPress={handleLongPress}>
                            <Text className="text-blue-500 font-semibold">+ expenses</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <View className="mt-2">
                    <LatestEntries data={data}/>
                </View>
            </View>
            <AddExpensesModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                successModalOpen={successModalOpen}
            />
            <SuccessModal
                visible={showSuccessModal}
                message="successfully added an expense"
                onContinue={onContinue}
            />
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4285F4"
    },
    topContainer: {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: "white"
    }
})
