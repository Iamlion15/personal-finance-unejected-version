import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"; // Added StyleSheet

type AmountProps = {
  amount: number;
  onReset: () => void;
  onShow: () => void;
};

const AmountBadge = ({ amount, onReset, onShow }: AmountProps) => {
  return (
    <View className="w-full">
      {/* Main container with buttons and amount */}
      <View
        className="bg-white rounded-2xl w-full border border-gray-100"
        style={styles.container} // Added style for shadow
      >
        {/* Button row */}
        <View className="flex-row justify-between items-center px-4 py-3">
          {/* Reset Button */}
          <TouchableOpacity
            onPress={onReset}
            className="bg-gray-100 rounded-xl px-4 py-2 min-w-20 justify-center items-center" // Removed hover/active classes
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-sm font-semibold">Reset</Text>
          </TouchableOpacity>

          {/* Amount Display */}
          <View className="flex-1 mx-4 justify-center items-center">
            <Text className="text-black text-lg font-bold tracking-wide">
              RWF {amount}
            </Text>
          </View>

          {/* Show Button */}
          <TouchableOpacity
            onPress={onShow}
            className="bg-blue-500 rounded-xl px-4 py-2 min-w-20 justify-center items-center" // Removed hover/active/shadow classes
            activeOpacity={0.7}
            style={styles.showButton} // Added style for shadow
          >
            <Text className="text-white text-sm font-semibold">Show</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowOffset: { width: 0, height: 2 }, // Equivalent to shadow-lg
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  showButton: {
    shadowOffset: { width: 0, height: 1 }, // Equivalent to shadow-sm
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android
  },
});

export default AmountBadge;