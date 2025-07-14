import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type propsDef = {
    message: string
}

const ErrorMessageComponent = ({ message }: propsDef) => {
    return (
        <View className="flex-row items-center bg-red-100 p-2 rounded-md">
            <FontAwesome name="exclamation-circle" size={16} color="red" className="mr-2" />
            <Text className="text-red-600 text-sm">{message}</Text>
        </View>
    );
};

export default ErrorMessageComponent;