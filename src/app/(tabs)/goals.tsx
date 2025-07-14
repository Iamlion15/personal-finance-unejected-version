import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AddGoalModal from '@/src/component/addGoalModal';
import SuccessModal from '@/src/component/successModal';
import renderGoalItem from '@/src/component/renderGoalItem';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { setGoal, } from '@/src/redux/slices/goalSlices';
import { goal } from '@/src/redux/slices/goalSlices';

interface GoalItem extends goal {
}

const AllGoals: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const successModalOpen = () => {
        setShowSuccessModal(true);
    };
    const onContinue = () => {
        setShowSuccessModal(false);
    }
    const data = useSelector((state: RootState) => state.goal.goals);
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
                const response = await axios.get(`${apiUrl}/trans/api/v1/set/goals`, config);
                dispatch(setGoal(response.data.goals));
            } catch (error) {
                console.error('Failed to fetch goals:', error);
            }
        };

        fetchExpenses();
    }, [dispatch]);

    return (
        <View className="p-4">
            <View className='flex-row justify-between mb-3'>
                <Text className="text-lg font-bold text-gray-800 mb-4">ALL GOALS</Text>
                <TouchableOpacity className="border border-blue-500 rounded-xl px-4 py-2" onPress={() => setModalVisible(true)}>
                    <Text className="text-blue-500 font-semibold">+ Goals</Text>
                </TouchableOpacity>

            </View>
            <FlatList
                data={data}
                renderItem={renderGoalItem}
                keyExtractor={(item) => item.name}
                showsVerticalScrollIndicator={false}
            />
            <AddGoalModal
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
    );
};

export default AllGoals;