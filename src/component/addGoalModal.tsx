import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather } from '@expo/vector-icons';
import CustomDatePicker from '@/src/component/customDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import validator from 'validator'
import { getUserData } from '../Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { addGoal, clearGoal } from '../redux/slices/goalSlices';

type AddGoalModalProps = {
    isVisible: boolean;
    onClose: () => void;
    successModalOpen: () => void;
};

type goalsProp = {
    category: string;
    name: string;
    amount: string;
    month: Date;
}

const categories = [
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
    { label: 'One time', value: 'One-time' },
];
const inputStyle = 'bg-gray-50 rounded-lg p-3 text-base text-gray-800 border border-gray-200';
const labelStyle = 'text-lg font-semibold text-gray-800 mb-3';

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isVisible, onClose, successModalOpen }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [disableDate, setDisableDate] = useState(true);
    const [goalData, setGoalData] = useState<goalsProp>({
        category: "",
        name: "",
        amount: "",
        month: new Date(),
    });
    const [goalDataError, setGoalDataError] = useState({
        category: "",
        name: "",
        amount: "",
        month: "",
    });

    const onChangeText = (type: string, value: any) => {
        switch (type) {
            case "amount":
                setGoalData({ ...goalData, amount: value });
                if (!value || value === '0') {
                    setGoalDataError({ ...goalDataError, amount: "Amount is required" });
                } else {
                    setGoalDataError({ ...goalDataError, amount: "" });
                }
                break;
            case "name":
                setGoalData({ ...goalData, name: value });
                if (!validator.isLength(value, { min: 1 })) {
                    setGoalDataError({ ...goalDataError, name: "Name is required" });
                } else {
                    setGoalDataError({ ...goalDataError, name: "" });
                }
                break;
            case "category":
                setGoalData({ ...goalData, category: value });
                if (!validator.isLength(value, { min: 1 })) {
                    setGoalDataError({ ...goalDataError, category: "Category is required" });
                } else {
                    setGoalDataError({ ...goalDataError, category: "" });
                    updateDateBasedOnCategory(value);
                }
                break;
            case "month":
                setGoalData({ ...goalData, month: value });
                if (!value) {
                    setGoalDataError({ ...goalDataError, month: "Date is required" });
                } else {
                    setGoalDataError({ ...goalDataError, month: "" });
                }
                break;
        }
    };

    // Separate function to update date based on category selection
    const updateDateBasedOnCategory = (category: string) => {
        const currentDate = new Date();
        let targetDate = new Date(currentDate);

        switch (category) {
            case "Monthly":
                targetDate.setMonth(currentDate.getMonth() + 1);
                setGoalData(prev => ({ ...prev, month: targetDate }));
                setDisableDate(true);
                break;
            case "Weekly":
                targetDate.setDate(currentDate.getDate() + 7);
                setGoalData(prev => ({ ...prev, month: targetDate }));
                setDisableDate(true);
                break;
            case "Yearly":
                targetDate.setFullYear(currentDate.getFullYear() + 1);
                setGoalData(prev => ({ ...prev, month: targetDate }));
                setDisableDate(true);
                break;
            case "One-time":
                setDisableDate(false); // Allow user to pick date manually
                break;
            default:
                setDisableDate(true);
        }
    };

    const handleSubmit = async () => {
        // Validate before submission
        if (!goalData.name || !goalData.category || !goalData.amount) {
            // Set appropriate error messages
            setGoalDataError({
                name: !goalData.name ? "Name is required" : "",
                category: !goalData.category ? "Category is required" : "",
                amount: !goalData.amount ? "Amount is required" : "",
                month: "",
            });
            return;
        }

        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        try {
            const token = await getUserData();
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${apiUrl}/trans/api/v1/set/goal`, goalData, config);
            dispatch(clearGoal())
            dispatch(addGoal(response.data.goal));
            onClose();
            successModalOpen();
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const onOpenDatePicker = () => {
        setModalVisible(true);
    };

    const onCancel = () => {
        setModalVisible(false);
    };

    const onConfirm = (date: Date) => {
        setGoalData(prevState => ({ ...prevState, month: date }));
        setModalVisible(false);
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="flex-1 bg-white">
                <View className="bg-white rounded-xl p-6 shadow-lg">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-blue-600">Add Goals</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-6">
                        <Text className={labelStyle}>Goal target</Text>
                        <TextInput
                            className={inputStyle}
                            placeholder="Enter goal"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="ascii-capable"
                            value={goalData.name}
                            onChangeText={(text) => onChangeText('name', text)}
                        />
                        {goalDataError.name ? (
                            <Text className="text-red-500 mt-1">{goalDataError.name}</Text>
                        ) : null}
                    </View>

                    <View className="mb-6">
                        <Text className={labelStyle}>Goal Type</Text>
                        <Dropdown
                            style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}
                            placeholderStyle={{ color: '#9CA3AF' }}
                            selectedTextStyle={{ color: '#374151' }}
                            data={categories}
                            labelField="label"
                            valueField="value"
                            placeholder="Select category"
                            value={goalData.category}
                            onChange={(item) => onChangeText('category', item.value)}
                            renderRightIcon={() => <Feather name="chevron-down" size={20} color="#374151" />}
                        />
                        {goalDataError.category ? (
                            <Text className="text-red-500 mt-1">{goalDataError.category}</Text>
                        ) : null}
                    </View>

                    <View className="mb-6">
                        <Text className={labelStyle}>Pick due date</Text>
                        <TouchableOpacity
                            disabled={disableDate}
                            className={`bg-gray-50 rounded-lg p-3 border border-gray-200 flex-row justify-between items-center ${disableDate ? 'opacity-70' : ''}`}
                            onPress={onOpenDatePicker}
                        >
                            <Text className="text-base text-gray-800">
                                {goalData.month.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </Text>
                            <Feather name="calendar" size={20} color={disableDate ? "#9CA3AF" : "#374151"} />
                        </TouchableOpacity>
                        {goalDataError.month ? (
                            <Text className="text-red-500 mt-1">{goalDataError.month}</Text>
                        ) : (
                            disableDate && goalData.category ? (
                                <Text className="text-gray-500 text-sm mt-1">Due date automatically set based on goal type</Text>
                            ) : null
                        )}
                    </View>

                    <View className="mb-6">
                        <Text className={labelStyle}>Amount</Text>
                        <TextInput
                            className={inputStyle}
                            placeholder="Enter amount (RWF)"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={goalData.amount}
                            onChangeText={(text) => onChangeText('amount', text)}
                        />
                        {goalDataError.amount ? (
                            <Text className="text-red-500 mt-1">{goalDataError.amount}</Text>
                        ) : null}
                    </View>

                    <View className="flex-row justify-end">
                        <TouchableOpacity className="bg-gray-200 rounded-lg px-6 py-3 mr-3" onPress={onClose}>
                            <Text className="text-base font-semibold text-gray-800">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-blue-500 rounded-lg px-6 py-3" onPress={handleSubmit}>
                            <Text className="text-base font-semibold text-white">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <CustomDatePicker
                    value={new Date(goalData.month)}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    open={modalVisible}
                />
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddGoalModal;