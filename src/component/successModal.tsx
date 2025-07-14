import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type SuccessModalProps = {
  visible: boolean;
  message: string;
  onContinue: () => void;
};

const SuccessModal = ({ visible, message, onContinue }: SuccessModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/30">
        <View 
          className="bg-white p-6 rounded-lg w-4/5 items-center shadow-lg shadow-black/50"
          style={{
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
        >
          <View className="bg-purple-100 rounded-full p-4 mb-4">
            <FontAwesome name="check-circle" size={50} color="#6B7280" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Transaction Successful!
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            {message}
          </Text>
          <TouchableOpacity
            className="bg-purple-600 p-3 rounded-md w-full"
            onPress={onContinue}
          >
            <Text className="text-white text-center font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;