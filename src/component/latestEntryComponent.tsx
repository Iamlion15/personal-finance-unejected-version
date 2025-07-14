import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { overview } from '../redux/slices/dashboardSlice';


interface EntryItem extends overview{}

type entryProps = {
  data: EntryItem[]
}

const data: EntryItem[] = [
  { _id: '1', icon: 'dollar-sign', name: 'Grocery Shopping', category: 'expense', date: 'May 17, 2025' },
  { _id: '2', icon: 'save', name: 'Emergency Fund', category: 'savings', date: 'May 16, 2025' },
  { _id: '3', icon: 'shopping-bag', name: 'Online Purchase', category: 'expense', date: 'May 15, 2025' },
  { _id: '4', icon: 'save', name: 'Vacation Savings', category: 'savings', date: 'May 14, 2025' },
];

const LatestEntries: React.FC<entryProps> = ({ data }) => {
  const renderEntryItem = ({ item }: { item: EntryItem }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-md border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-gray-100 p-2 rounded-full mr-3">
            <Feather name={item.icon as any} size={20} color="#374151" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-500">
              {item.category === 'savings' ? 'Savings' : 'Expense'}
            </Text>
            <Text className="text-xs text-gray-400">{item.date}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500">•••</Text>
      </View>
    </View>
  );

  return (
    <View className="p-2 bg-gray-50">
      <FlatList
        data={data}
        renderItem={renderEntryItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default LatestEntries;