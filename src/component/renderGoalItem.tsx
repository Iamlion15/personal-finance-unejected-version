import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";


type GoalItem = {
    category: string;
    name: string;
    amount: number;
    month: string;
    savingsAmount:string;
    percentage:number;
};

const renderGoalItem = ({ item }: { item: GoalItem }) => {

        return (
            <View className="flex-row items-center mb-4">
                <View className="bg-gray-100 p-2 rounded-full mr-3">
                    <Feather name="smartphone" size={20} color="#374151" />
                </View>
                <View className="flex-1 bg-white p-4 rounded-lg mb-2 shadow-md">
                    <View className='flex-row justify-between ml-3 mr-3'>
                        <Text className="text-base font-semibold text-gray-800 mb-1">{item.name}</Text>
                        <TouchableOpacity className='mb-3' onPress={() => console.log('Pressed')}>
                            <Text className="text-xl text-gray-500">•••</Text>
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 mb-1">Goal set for {item.month}</Text>
                    <View className="flex-row items-center">
                        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <View
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </View>
                        <Text className="text-sm font-semibold text-gray-800">
                            ${item.amount} /
                        </Text>
                        <Text className="text-sm font-semibold text-gray-400 ml-2">
                            ${item.savingsAmount}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    export default renderGoalItem