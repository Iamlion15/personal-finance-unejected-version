import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type GoalItem = {
  category: string;
  name: string;
  amount: number;
  month: string;
  savingsAmount: string;
  percentage: number;
};

const SavingsList: React.FC<{ data: GoalItem[] }> = ({ data }) => {
  const renderGoalItem = ({ item }: { item: GoalItem }) => (
    <View className="bg-white p-4 rounded-lg mb-2 shadow-md">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="bg-gray-100 p-2 rounded-full mr-2">
            <Feather name="smartphone" size={20} color="#374151" />
          </View>
          <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
        </View>
      </View>
      <Text className="text-sm text-gray-500 mb-2">Goal set for {item.month}</Text>
      <View className="flex-row items-center">
        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${item.percentage}%` }}
          />
        </View>
        <Text className="text-base font-semibold text-gray-800">
          ${item.savingsAmount} /
        </Text>
        <Text className="text-base font-semibold text-gray-400 ml-2">
          ${item.amount}
        </Text>
      </View>
    </View>
  );
  return (
    <FlatList
      data={data}
      renderItem={renderGoalItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default SavingsList;