import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

type NotificationItem = {
  id: string;
  reminderDate: string;
  name: string;
  amount: number;
  dueDate: string;
  icon: string;
};

const data: NotificationItem[] = [
  { id: '1', reminderDate: '26 May 2024', name: 'Bill Payment', amount: 200, dueDate: '3 Jun 2024', icon: 'dollar-sign' },
  { id: '2', reminderDate: '26 May 2024', name: 'Car Loan', amount: 6000, dueDate: '11 Jul 2024', icon: 'car' },
  { id: '3', reminderDate: '26 May 2024', name: 'iPhone 15 Pro', amount: 1000, dueDate: '3 Aug 2024', icon: 'smartphone' },
  { id: '4', reminderDate: '26 May 2024', name: 'New Bike', amount: 2300, dueDate: '12 Sep 2024', icon: 'bike' },
];

const Notifications: React.FC = () => {
  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-md border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-gray-100 p-2 rounded-full mr-3">
            <Feather name={item.icon as any} size={20} color="#374151" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-800">Reminder Date: {item.reminderDate}</Text>
            <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-600">₹ {item.amount}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500">•••</Text>
      </View>
      <Text className="text-sm text-gray-500 mt-2">Due on {item.dueDate}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Notifications</Text>
      <FlatList
        data={data}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Notifications;