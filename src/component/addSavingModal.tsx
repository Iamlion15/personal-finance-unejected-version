import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { getUserData } from '@/src/Utils/asyncStorageLoginDetails';
import axios from 'axios';
import { addGoal,clearGoal } from '@/src/redux/slices/goalSlices';
import validator from 'validator';
import CustomDatePicker from './customDatePicker';

type AddEntryModalProps = {
  isVisible: boolean;
  onClose: () => void;
  successModalOpen: () => void;
};

type categoriesProp = {
  label: string;
  value: string;
};

type savingProp = {
  goal: string;
  amount: string;
  description: string;
};

const inputStyle = 'bg-gray-50 rounded-lg p-3 text-base text-gray-800 border border-gray-200';
const labelStyle = 'text-lg font-semibold text-gray-800 mb-3';
const errorStyle = 'text-red-500 text-sm mt-1';

const AddSavingsModal: React.FC<AddEntryModalProps> = ({ isVisible, onClose, successModalOpen }) => {
  const [categories, setCategories] = useState<categoriesProp[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [salaryActive, setSalaryArchive] = useState(false)
  const data = useSelector((state: RootState) => state.goal.goals);
  const dispatch = useDispatch();

  const [savingData, setSavingData] = useState<savingProp>({
    goal: "",
    amount: "",
    description: "",
  });

  const [savingDataError, setSavingDataError] = useState({
    goal: "",
    amount: "",
    description: "",
  });
  const [salaryData, setSalaryData] = useState({
    salaryAmount: "",
    payDate: new Date(),
    salaryDescription: "",
  });
  const [salaryDataError, setSalaryDataError] = useState({
    salaryAmount: "",
    payDate: "",
    salaryDescription: "",
  });

  const onOpenDatePicker = () => {
    setModalVisible(true);
  };

  const onCancel = () => {
    setModalVisible(false);
  };

  const onConfirm = (date: Date) => {
    setSalaryData(prevState => ({ ...prevState, payDate: date }));
    setModalVisible(false);
  };


  const onChangeText = (type: string, value: any) => {
    switch (type) {
      case "goal":
        setSavingData({ ...savingData, goal: value });
        if (!validator.isLength(value, { min: 1 })) {
          setSavingDataError({ ...savingDataError, goal: "Goal is required" });
        } else {
          setSavingDataError({ ...savingDataError, goal: "" });
        }
        break;
      case "amount":
        setSavingData({ ...savingData, amount: value });
        if (!value || value === '0' || !validator.isNumeric(value)) {
          setSavingDataError({ ...savingDataError, amount: "Valid amount is required" });
        } else {
          setSavingDataError({ ...savingDataError, amount: "" });
        }
        break;
      case "description":
        setSavingData({ ...savingData, description: value });
        if (!validator.isLength(value, { min: 1 })) {
          setSavingDataError({ ...savingDataError, description: "Description is required" });
        } else {
          setSavingDataError({ ...savingDataError, description: "" });
        }
        break;
      case "salaryAmount":
        setSalaryData(prev => ({ ...prev, salaryAmount: value }));
        if (!value || value === "0" || !validator.isNumeric(value)) {
          setSalaryDataError(prev => ({ ...prev, salaryAmount: "Valid salary amount is required" }));
        } else {
          setSalaryDataError(prev => ({ ...prev, salaryAmount: "" }));
        }
        break;

      case "payDate":
        setSalaryData(prev => ({ ...prev, payDate: value }));
        if (!validator.isDate(value)) {
          setSalaryDataError(prev => ({ ...prev, payDate: "Valid pay date is required (e.g., YYYY-MM-DD)" }));
        } else {
          setSalaryDataError(prev => ({ ...prev, payDate: "" }));
        }
        break;

      case "salaryDescription":
        setSalaryData(prev => ({ ...prev, salaryDescription: value }));
        if (!validator.isLength(value, { min: 1 })) {
          setSalaryDataError(prev => ({ ...prev, salaryDescription: "Description is required" }));
        } else {
          setSalaryDataError(prev => ({ ...prev, salaryDescription: "" }));
        }
        break;

      default:
        break;
    }
  };

  const handleSave = async () => {
    // Validate all fields before submission
    const errors = {
      goal: !savingData.goal ? "Goal is required" : "",
      amount: !savingData.amount || savingData.amount === '0' || !validator.isNumeric(savingData.amount) ? "Valid amount is required" : "",
      description: !savingData.description ? "Description is required" : "",
    };

    setSavingDataError(errors);

    // Check if there are any errors
    if (errors.goal || errors.amount || errors.description) {
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

      const response = await axios.post(`${apiUrl}/trans/api/v1/saving`, savingData, config);
      // dispatch(clearGoal());
      dispatch(addGoal(response.data.goal));

      // Reset form
      setSavingData({
        goal: "",
        amount: "",
        description: "",
      });
      setSavingDataError({
        goal: "",
        amount: "",
        description: "",
      });

      onClose();
      successModalOpen();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleSaveSalary = async () => {
    const errors = {
      salaryAmount: !salaryData.salaryAmount || salaryData.salaryAmount === '0' || !validator.isNumeric(salaryData.salaryAmount)
        ? "Valid salary amount is required"
        : "",
      payDate: !validator.isEmpty(String(salaryData.payDate))
        ? "Valid pay date is required (e.g., YYYY-MM-DD)"
        : "",
      salaryDescription: !salaryData.salaryDescription
        ? "Description is required"
        : "",
    };

    setSalaryDataError(errors);

    if (errors.salaryAmount || errors.payDate || errors.salaryDescription) {
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

      const response = await axios.post(`${apiUrl}/trans/api/v1/salary`, salaryData, config);

      // Optional: dispatch or update state with the response if needed
      // dispatch(addSalary(response.data.salary));

      // Reset form
      setSalaryData({
        salaryAmount: "",
        payDate: new Date(),
        salaryDescription: "",
      });

      setSalaryDataError({
        salaryAmount: "",
        payDate: "",
        salaryDescription: "",
      });

      onClose();
      successModalOpen();
    } catch (error) {
      console.error("Error saving salary:", error);
    }
  };


  useEffect(() => {
    if (data && data.length > 0) {
      const formattedCategories = [
        { label: 'salary', value: '1' },
        ...data.map((goal) => ({
          label: goal.name,
          value: goal._id
        }))
      ];
      setCategories(formattedCategories);
    }
  }, [data]);

  useEffect(() => {
    if (savingData.goal === '1') {
      setSalaryArchive(true)
    }
    else {
      setSalaryArchive(false)
    }
  }, [savingData.goal])


  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose}>
      <View className="bg-white rounded-xl p-6 shadow-lg">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Add Savings</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        {!salaryActive && (
          <>
            <View className="mb-6">
              <Text className={labelStyle}>Category</Text>
              <Dropdown
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: savingDataError.goal ? '#EF4444' : '#E5E7EB'
                }}
                placeholderStyle={{ color: '#9CA3AF' }}
                selectedTextStyle={{ color: '#374151' }}
                data={categories}
                labelField="label"
                valueField="value"
                placeholder="Select category"
                value={savingData.goal}
                onChange={(item) => onChangeText("goal", item.value)}
                renderRightIcon={() => <Feather name="chevron-down" size={20} color="#374151" />}
              />
              {savingDataError.goal ? <Text className={errorStyle}>{savingDataError.goal}</Text> : null}
            </View>

            <View className="mb-6">
              <Text className={labelStyle}>Amount</Text>
              <TextInput
                className={`${inputStyle} ${savingDataError.amount ? 'border-red-500' : ''}`}
                placeholder="Enter amount (RWF)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={savingData.amount}
                onChangeText={(value) => onChangeText("amount", value)}
              />
              {savingDataError.amount ? <Text className={errorStyle}>{savingDataError.amount}</Text> : null}
            </View>

            <View className="mb-6">
              <Text className={labelStyle}>Description</Text>
              <TextInput
                className={`${inputStyle} ${savingDataError.description ? 'border-red-500' : ''}`}
                placeholder="Enter description"
                placeholderTextColor="#9CA3AF"
                value={savingData.description}
                onChangeText={(value) => onChangeText("description", value)}
                multiline
              />
              {savingDataError.description ? <Text className={errorStyle}>{savingDataError.description}</Text> : null}
            </View>
          </>
        )}
        {salaryActive && (
          <>
            <View className="mb-6">
              <Text className={labelStyle}>Salary Amount</Text>
              <TextInput
                className={`${inputStyle} ${salaryData.salaryAmount ? 'border-red-500' : ''}`}
                placeholder="Enter salary amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={salaryData.salaryAmount}
                onChangeText={(value) => onChangeText("salaryAmount", value)}
              />
              {salaryDataError.salaryAmount ? <Text className={errorStyle}>{salaryDataError.salaryAmount}</Text> : null}
            </View>

            <View className="mb-6">
              <Text className={labelStyle}>Pick Pay Date</Text>
              <TouchableOpacity
                className={`bg-gray-50 rounded-lg p-3 border border-gray-200 flex-row justify-between items-center `}
                onPress={onOpenDatePicker}
              >
                <Text className="text-base text-gray-800">
                  {salaryData.payDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Feather name="calendar" size={20} color="#374151" />
              </TouchableOpacity>
              {salaryDataError.payDate ? <Text className={errorStyle}>{salaryDataError.payDate}</Text> : null}
            </View>

            <View className="mb-6">
              <Text className={labelStyle}>Salary Description</Text>
              <TextInput
                className={`${inputStyle} ${salaryData.salaryDescription ? 'border-red-500' : ''}`}
                placeholder="Enter salary description"
                placeholderTextColor="#9CA3AF"
                value={salaryData.salaryDescription}
                onChangeText={(value) => onChangeText("salaryDescription", value)}
                multiline
              />
              {salaryDataError.salaryDescription ? <Text className={errorStyle}>{salaryDataError.salaryDescription}</Text> : null}
            </View>
          </>
        )}

        <View className="flex-row justify-end">
          <TouchableOpacity className="bg-gray-200 rounded-lg px-6 py-3 mr-3" onPress={onClose}>
            <Text className="text-base font-semibold text-gray-800">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 rounded-lg px-6 py-3" onPress={savingData.goal === "1" ? handleSaveSalary : handleSave}>
            <Text className="text-base font-semibold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomDatePicker
        value={new Date(salaryData.payDate)}
        onConfirm={onConfirm}
        onCancel={onCancel}
        open={modalVisible}
      />
    </Modal>
  );
};

export default AddSavingsModal;