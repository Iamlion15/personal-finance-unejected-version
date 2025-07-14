import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import months from '../Utils/getMonths';
import { GoalTracker } from '../redux/slices/dashboardSlice';


const GoalTrackerComponent = ({ data }: { data: GoalTracker[] }) => {
    const [selectedMonth, setSelectedMonth] = useState('1');
    const selectedMonthName = months.find(m => m.id === selectedMonth)?.name;
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const selectedGoalTrackerData = data.find(item => item.month.toString() === selectedMonth) || { percentage: 0, target: 0, saved: 0 };


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

    return (
        <View className="bg-white p-4 rounded-xl shadow-md">
            {/* Header with Month and Toggle */}
            <TouchableOpacity
                className="flex-row items-center mb-3"
                onPress={() => setIsPickerVisible(true)}
            >
                <Feather name="calendar" size={20} color="#374151" className="mr-2" />
                <Text className="text-base font-semibold text-gray-800">{selectedMonthName}</Text>
                <Feather
                    name={isPickerVisible ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#374151"
                    className="ml-2"
                />
            </TouchableOpacity>

            <Modal
                isVisible={isPickerVisible}
                onBackdropPress={() => setIsPickerVisible(false)}
                onBackButtonPress={() => setIsPickerVisible(false)}
                style={{ justifyContent: 'center', margin: 20 }}
            >
                <View className="bg-white rounded-lg max-h-80">
                    {/* Modal Header */}
                    <View className="py-3 px-4 border-b border-gray-200 items-center">
                        <Text className="text-lg font-semibold text-gray-800">Months of the Year</Text>
                    </View>
                    {/* Month List */}
                    <FlatList
                        data={months}
                        renderItem={renderMonthItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </Modal>

            {/* Goal Text */}
            <View className='flex-row space-between'>
                <Text className="text-sm text-gray-500 mb-3">Goal for the month</Text>
                <Text adjustsFontSizeToFit minimumFontScale={0.5} className="ml-2 text-sm font-semibold text-gray-900">RWF {selectedGoalTrackerData.target}</Text>
            </View>
            {/* Progress Bar */}
            <View className="flex-row items-center w-full">
                <View className="flex-[3] h-10 bg-gray-200 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedGoalTrackerData.percentage}%` }}
                    />
                </View>
                <View className="flex-1 flex-row items-center justify-start ml-3 flex-shrink-1">
                    <Text adjustsFontSizeToFit minimumFontScale={0.5} className="text-base font-semibold text-gray-800">RWF {selectedGoalTrackerData.saved}</Text>

                </View>
            </View>
        </View>
    );
};

export default GoalTrackerComponent;