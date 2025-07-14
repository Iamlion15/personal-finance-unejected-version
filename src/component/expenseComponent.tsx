import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { expense } from '../redux/slices/expensesSlices';
import getIconForCategory from '../Utils/iconCategoryFactory';
import { formatDate } from '../Utils/dateHelper';

interface BaseItemProps {
  _id: string;
  category: string;
  createdAt: string;
  amount: number | string;
  source: string;
  icon?: string;
}

interface ExpenseItemProps extends BaseItemProps {
  item: string;
}

interface CategoryItemProps extends BaseItemProps {
  transactionCount: number;
}

type ListItemType = ExpenseItemProps | CategoryItemProps;

export default function SpendCategories({ expenses = [] }: { expenses?: expense[] }) {
  const [activeTab, setActiveTab] = useState<'spends' | 'categories'>('spends');

  // Map expenses to include icons using getIconForCategory
  const mappedExpenses: ExpenseItemProps[] = useMemo(() => {
    if (!expenses) return [];
    return expenses.map((item: expense) => ({
      ...item,
      createdAt: formatDate(item.createdAt),
      amount: `+${item.amount}`,
      icon: getIconForCategory(item.category) || 'circle',
    }));
  }, [expenses]);

  // Group items by category for the categories tab
  const categoriesData = useMemo(() => {
    const groups: Record<string, ExpenseItemProps[]> = {};

    mappedExpenses.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return Object.entries(groups).map(([category, items]) => {
      const totalAmount = items.reduce((sum, item) => {
        const numAmount = typeof item.amount === 'string'
          ? parseFloat(item.amount.replace(/[^0-9.-]+/g, ''))
          : item.amount;
        return sum + numAmount;
      }, 0);

      const formattedAmount = totalAmount >= 0 ? `+${totalAmount}` : `-$${Math.abs(totalAmount)}`;
      return {
        _id: category,
        category: category,
        createdAt: 'Last month',
        amount: formattedAmount,
        source: `${items.length} transactions`,
        icon: items[0].icon,
        transactionCount: items.length,
        item: ''
      } as ListItemType;
    });
  }, [mappedExpenses]);

  const renderSpendItem = ({ item, index }: { item: ListItemType, index: number }) => (
    <View>
      <View className="py-4 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <View className="bg-gray-100 p-2 rounded-full">
            <Feather name={item.icon as any} size={22} color="#374151" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-800">{item.category}</Text>
            <Text className="text-sm text-gray-500">{item.createdAt}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className={`text-base font-bold ${String(item.amount).includes('+') ? 'text-green-600' : 'text-gray-800'}`}>
            {item.amount} RWF
          </Text>
          <Text className="text-xs text-gray-500">{item.source}</Text>
        </View>
      </View>
      {index < (activeTab === 'spends' ? mappedExpenses.length - 1 : categoriesData.length - 1) && (
        <View className="h-px bg-gray-200" />
      )}
    </View>
  );

  // Render nothing or a loading indicator if expenses is undefined or empty
  if (!expenses || expenses.length === 0) {
    return (
      <View className="bg-white flex-1 justify-center items-center">
        <Text className="text-gray-500 text-base">No expenses available</Text>
      </View>
    );
  }

  return (
    <View className="bg-white">
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === 'spends' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('spends')}
        >
          <Text className={`text-center font-medium ${activeTab === 'spends' ? 'text-blue-500' : 'text-gray-500'}`}>
            Spends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === 'categories' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('categories')}
        >
          <Text className={`text-center font-medium ${activeTab === 'categories' ? 'text-blue-500' : 'text-gray-500'}`}>
            Categories
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === 'spends' ? mappedExpenses : categoriesData}
        renderItem={renderSpendItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        className="px-4"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
});