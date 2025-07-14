import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import months from '../Utils/getMonths';
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setMonthlySalary } from '../redux/slices/dashboardSlice';

const TotalSavingsComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState('1');
    const selectedMonthName = months.find(m => m.id === selectedMonth)?.name;
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const data_monthly_salary = useSelector((state: RootState) => state.salary.salaries);
  const selectedSalary = data_monthly_salary.find(item => item.month.toString() === selectedMonth)?.salary || 0;
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
        const response = await axios.get(`${apiUrl}/trans/api/v1/salary`, config);
        dispatch(setMonthlySalary(response.data.data));
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      }
    };

    fetch_monthly_income_expense_salary();
  }, [dispatch]);

  return (
    <View className="p-4 rounded-lg">
      {/* Month Selector */}
      <TouchableOpacity
        className="flex-row items-center justify-center mb-4"
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
      <Text className="text-4xl font-bold text-white mb-2">RWF {selectedSalary.toLocaleString()}</Text>
      <Text className="text-base font-medium text-center text-white">Monthly savings</Text>
    </View>
  );
};

export default TotalSavingsComponent;