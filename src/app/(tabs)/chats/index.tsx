import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { getUserData } from "@/src/Utils/asyncStorageLoginDetails";
import axios from "axios";
import SendMessageModal from "@/src/component/sendMessageModal";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/redux/store'; // adjust path as needed
import { setChats, clearChats, addChat } from '@/src/redux/slices/chatSlice';

interface Chat {
    _id: string;
    participants: Array<{
        _id: string;
        FullName: string;
    }>;
    message: Array<{
        content: string;
        createdAt: string;
        sender: {
            _id: string;
            FullName: string;
        };
    }>;
    createdAt: string;
    updatedAt: string;
}

export default function ChatList() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    // const [chats, setChats] = useState<Chat[]>([]);
    const dispatch = useDispatch();
    const chats = useSelector((state: RootState) => state.chat.chats);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChats = async () => {
        try {
            setError(null);
            const apiUrl = process.env.EXPO_PUBLIC_API_URL
            const token = await getUserData();
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            };
            const response: any = await axios.get(`${apiUrl}/user/api/v1/message/getmessages`, config);
            const responseAdmin: any = await axios.get(`${apiUrl}/user/api/v1/message/admin`, config);
            // setChats(response.data)
            dispatch(clearChats());
            dispatch(setChats(response.data));
            setAdmin(responseAdmin.data.admin_id)

        } catch (err) {
            console.log(err)
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchChats();
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getLastMessage = (chat: Chat) => {
        if (!chat.message || chat.message.length === 0) {
            return "No messages yet";
        }
        return chat.message[chat.message.length - 1].content;
    };

    const getOtherParticipant = (chat: Chat, currentUserId: string) => {
        return chat.participants.find(p => p._id !== currentUserId);
    };

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center px-8 mt-5">
            <Text className="text-gray-500 text-lg font-medium mb-2">No messages found</Text>
            <Text className="text-gray-400 text-center">
                You don't have any conversations yet. Start chatting with users!
            </Text>
        </View>
    );

    const renderErrorState = () => (
        <View className="flex-1 justify-center items-center px-8">
            <Text className="text-red-500 text-lg font-medium mb-2">Failed to load chats</Text>
            <Text className="text-gray-400 text-center mb-4">{error}</Text>
            <TouchableOpacity
                onPress={fetchChats}
                className="bg-blue-500 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: Chat }) => {
        const otherParticipant = getOtherParticipant(item, admin);
        const lastMessage = getLastMessage(item);
        const lastMessageTime = item.message && item.message.length > 0
            ? formatTime(item.message[item.message.length - 1].createdAt)
            : formatTime(item.createdAt);

        return (
            <TouchableOpacity
                className="px-4 py-4 border-b border-gray-100 active:bg-gray-50"
                onPress={() => router.push({
                    pathname: `/chats/${item._id}` ,
                    params: {
                        chatId: item._id,
                        name:otherParticipant?.FullName,
                        senderId: otherParticipant?._id,
                        receiverId: admin
                    }
                })}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                            {otherParticipant ? `${otherParticipant.FullName} ` : 'Unknown User'}
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-sm text-gray-500 mt-1"
                        >
                            {lastMessage}
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-400">{lastMessageTime}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-500">Loading chats...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-white">
                {renderErrorState()}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white mt-0">
            <View className='flex-row justify-between mb-3 mt-3 mx-4'>
                <Text className="text-lg font-bold text-gray-800 mb-4">ALL MESSAGES</Text>
                <TouchableOpacity className="border border-blue-500 rounded-xl px-4 py-2" onPress={() => setModalVisible(true)}>
                    <Text className="text-blue-500 font-semibold">+ Message</Text>
                </TouchableOpacity>

            </View>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            <SendMessageModal
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                admin={admin}
                fetchChats={fetchChats}
            />
        </View>
    );
}