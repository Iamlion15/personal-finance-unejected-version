import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type SignupProps = {
  visible: boolean;
  onLogin: () => void;
  onNotNow: () => void;
};

const SignupModal = ({ visible, onLogin, onNotNow }: SignupProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View className="bg-white p-6 rounded-lg w-4/5">
          <View className="items-center mb-4">
            <FontAwesome name="instagram" size={50} color="#E1306C" />
          </View>
          <Text className="text-center text-lg font-bold text-gray-900 mb-2">
            Congratulations!
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            You've successfully registered. Get started by logging in or come back later.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-md mb-2"
            onPress={onLogin}
          >
            <Text className="text-white text-center font-semibold">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3"
            onPress={onNotNow}
          >
            <Text className="text-center text-blue-500 font-semibold">Not Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default SignupModal;