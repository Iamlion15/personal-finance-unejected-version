import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import months from '../Utils/getMonths';
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setMonthlyData, setMonthlySalary } from '../redux/slices/dashboardSlice';


const OverviewHeader = () => {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const selectedMonthName = months.find(m => m.id === selectedMonth)?.name;
    const data_income_expense = useSelector((state: RootState) => state.income_expense.monthlyData);
    const data_monthly_salary = useSelector((state: RootState) => state.salary.salaries);
    const selectedSalary = data_monthly_salary.find(item => item.month.toString() === selectedMonth)?.salary || 0;
    const selectedIncomeData = data_income_expense.find(item => item.month.toString() === selectedMonth) || { income: 0, expense: 0 };

    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const dispatch = useDispatch()
    const renderMonthItem = ({ item }: { item: { id: string; name: string } }) => (
        <TouchableOpacity
            className="py-2 px-4 border-b border-gray-200"
            onPress={() => {
                setSelectedMonth(item.id);
                setIsPickerVisible(false);
            }}
        >
            <Text className="text-base text-gray-800">{item.name}</Text>
        </TouchableOpacity>
    );
    useEffect(() => {
        const fetch_monthly_income_expense_salary = async () => {
            const apiUrl = process.env.EXPO_PUBLIC_API_URL
            try {
                const token = await getUserData();
                const config = {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                };
                const response_monthly_income_expense = await axios.get(`${apiUrl}/trans/api/v1/dashboard/budget`, config);
                const response_monthly_salary = await axios.get(`${apiUrl}/trans/api/v1/salary`, config);
                dispatch(setMonthlyData(response_monthly_income_expense.data.data));
                dispatch(setMonthlySalary(response_monthly_salary.data.data));
            } catch (error) {
                console.error('Failed to fetch goals:', error);
            }
        };

        fetch_monthly_income_expense_salary();
    }, [dispatch]);
    return (
        <LinearGradient
            colors={['#1A73E8', '#4285F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="p-4"
        >
            {/* Month Selector */}
            <TouchableOpacity
                className="flex-row justify-center border border-white rounded-lg  py-2 shadow-md shadow-white/20 bg-white/10"
                onPress={() => setIsPickerVisible(true)}
            >
                <Text className="text-base font-semibold text-white mr-2">{selectedMonthName}</Text>
                <Feather name="chevron-down" size={20} color="#FFFFFF" />
            </TouchableOpacity>


            {/* Month Picker Modal */}
            <Modal
                isVisible={isPickerVisible}
                onBackdropPress={() => setIsPickerVisible(false)}
                onBackButtonPress={() => setIsPickerVisible(false)}
                style={{ justifyContent: 'center', margin: 20 }}
            >
                <View className="bg-white rounded-lg max-h-80">
                    <View className="py-3 px-4 border-b border-gray-200">
                        <Text className="text-lg font-semibold text-gray-800">Months of the Year</Text>
                    </View>
                    <FlatList
                        data={months}
                        renderItem={renderMonthItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>

            {/* Cash Flow Amount */}
            <View className='items-center mt-3 '>
                <Text className="text-4xl font-bold text-white mb-3">RWF {selectedSalary.toLocaleString()}</Text>
                <Text className="text-base font-medium text-white mb-6">monthly total salary</Text>
            </View>
            {/* Income and Expenses */}
            <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center border border-white rounded-xl p-4">
                    <View className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                        <Feather name="plus" size={16} color="#FFFFFF" />
                    </View>
                    <View >
                        <Text className="text-base font-semibold text-white">RWF {selectedIncomeData.income.toLocaleString()}</Text>
                        <Text className="text-sm text-white">Total income</Text>
                    </View>
                </View>
                <View className="flex-row items-center border border-white rounded-xl p-4">
                    <View className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                        <View className="h-0.5 w-3 bg-white" />
                    </View>
                    <View>
                        <Text className="text-base font-semibold text-white">RWF {selectedIncomeData.expense.toLocaleString()}</Text>
                        <Text className="text-sm text-white">Total expenses</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

export default OverviewHeader;