import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather } from '@expo/vector-icons';
import validator from 'validator'
import axios from 'axios';
import { getUserData } from '../Utils/asyncStorageLoginDetails';
import { useDispatch } from 'react-redux'
import { setExpense, clearExpense } from '../redux/slices/expensesSlices';

type AddEntryModalProps = {
  isVisible: boolean;
  onClose: () => void;
  successModalOpen: () => void;
};
type expenseTypes = {
  item: string,
  amount: string,
  category: string,
  source: string
}

const source = [
  { label: 'MoMo', value: 'MoMo' },
  { label: 'banking', value: 'banking' },
  { label: 'cash', value: 'cash' },
];
const categories = [
  { label: 'Food & Dining', value: 'food_dining' },
  { label: 'Travel & Transportation', value: 'travel_transportation' },
  { label: 'Shopping & Personal Items', value: 'shopping_personal' },
  { label: 'Bills & Utilities', value: 'bills_utilities' },
  { label: 'Health & Wellness', value: 'health_wellness' },
];

const AddExpensesModal: React.FC<AddEntryModalProps> = ({ isVisible, onClose, successModalOpen }) => {
  const dispatch = useDispatch();
  const [expenseData, setExpenseData] = useState<expenseTypes>({
    item: '',
    amount: '',
    category: '',
    source: ''
  });
  const [expenseDataError, setExpenseDataError] = useState({
    item: '',
    amount: '',
    source: '',
    category: ''
  })
  const inputStyle = 'bg-gray-50 rounded-lg p-3 text-base text-gray-800 border border-gray-200';
  const labelStyle = 'text-lg font-semibold text-gray-800 mb-3';
  
  const onChangeText = (type: string, value: string) => {
    switch (type) {
      case "amount":
        setExpenseData({ ...expenseData, amount: value })
        if (Number(value) >= 0) {
          setExpenseDataError({ ...expenseDataError, amount: "provide amount" })
        }
        else {
          setExpenseDataError({ ...expenseDataError, amount: "" })
        }
        break;
      case "item":
        setExpenseData({ ...expenseData, item: value })
        if (!validator.isLength(value, { min: 0 })) {
          setExpenseDataError({ ...expenseDataError, item: "item is required" })
        }
        else {
          setExpenseDataError({ ...expenseDataError, item: "" })
        }
        break;
      case "category":
        setExpenseData({ ...expenseData, category: value })
        if (!validator.isLength(value, { min: 0 })) {
          setExpenseDataError({ ...expenseDataError, category: "category is required" })
        }
        else {
          setExpenseDataError({ ...expenseDataError, category: "" })
        }
        break;
      case "source":
        setExpenseData({ ...expenseData, source: value })
        if (!validator.isLength(value, { min: 0 })) {
          setExpenseDataError({ ...expenseDataError, source: "source is required" })
        }
        else {
          setExpenseDataError({ ...expenseDataError, source: "" })
        }
        break;
    }
  }

  const handleSubmit = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    try {
      const token = await getUserData();
      console.log(token)
      const config = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(`${apiUrl}/trans/api/v1/transactions/expense`, expenseData, config);
      console.log('Saved:', response.data);
      dispatch(clearExpense())
      dispatch(setExpense(response.data.expense));
      onClose()
      successModalOpen()
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose} 
      onBackButtonPress={onClose} 
      useNativeDriver={true}
      avoidKeyboard={true}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View className="bg-white rounded-xl p-6 shadow-lg max-h-[90%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-blue-500">Add Expenses</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <View className="mb-4">
              <Text className={labelStyle}>Category</Text>
              <Dropdown
                style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderStyle={{ color: '#9CA3AF' }}
                selectedTextStyle={{ color: '#374151' }}
                data={categories}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={expenseData.category}
                onChange={(item) => onChangeText('category', item.value)}
                renderRightIcon={() => <Feather name="chevron-down" size={20} color="#374151" />}
              />
            </View>

            <View className="mb-4">
              <Text className={labelStyle}>Source</Text>
              <Dropdown
                style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' }}
                placeholderStyle={{ color: '#9CA3AF' }}
                selectedTextStyle={{ color: '#374151' }}
                data={source}
                labelField="label"
                valueField="value"
                placeholder="Select source"
                value={expenseData.source}
                onChange={(item) => onChangeText('source', item.value)}
                renderRightIcon={() => <Feather name="chevron-down" size={20} color="#374151" />}
              />
            </View>

            <View className="mb-4">
              <Text className={labelStyle}>Amount</Text>
              <TextInput
                className={inputStyle}
                placeholder="Enter amount (RWF)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={expenseData.amount}
                onChangeText={(text) => onChangeText('amount', text)}
              />
            </View>

            <View className="mb-6">
              <Text className={labelStyle}>Item name</Text>
              <TextInput
                className={inputStyle}
                placeholder="Enter item name"
                placeholderTextColor="#9CA3AF"
                value={expenseData.item}
                onChangeText={(text) => onChangeText('item', text)}
              />
            </View>
          </ScrollView>

          <View className="flex-row justify-end border-t border-gray-200 pt-4">
            <TouchableOpacity className="bg-gray-200 rounded-lg px-6 py-3 mr-3" onPress={onClose}>
              <Text className="text-base font-semibold text-gray-800">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 rounded-lg px-6 py-3" onPress={handleSubmit}>
              <Text className="text-base font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddExpensesModal;