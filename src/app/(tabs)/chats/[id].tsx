import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { getUserData } from "@/src/Utils/asyncStorageLoginDetails";

interface Message {
    messageId: string;
    content: string;
    sender: {
        userId: string;
        FullName: string;
    };
    read: {
        isRead: boolean;
        timeOfRead: string | null;
    };
    timestamp: string;
}

interface ChatData {
    chatId: string;
    title: string;
    participants: Array<{
        _id: string;
        FullName: string;
    }>;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export default function ChatScreen() {
    const { chatId, senderId, name, receiverId } = useLocalSearchParams<{
        chatId: string;
        senderId?: string;
        name: string;
        receiverId: string;
    }>();
    const router = useRouter();
    const navigation = useNavigation();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatData, setChatData] = useState<ChatData | null>(null);

    const currentUserId = "your_current_user_id"; // Replace with real user ID
    const apiUrl = process.env.EXPO_PUBLIC_API_URL; // Your API base URL
    const authToken = getUserData()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View className="flex-row items-center px-4 py-5 border-b border-gray-200 bg-white" style={{ marginTop: Platform.OS === "ios" ? 30 : 30 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="ml-4 text-lg font-bold text-gray-800">
                        {name || "Chat"}
                    </Text>
                </View>
            ),
        });
    }, [navigation, router, name]);

    const fetchMessages = async () => {
        try {
            setError(null);
            const token = await getUserData();
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${apiUrl}/user/api/v1/message/getchat`, { chatId, senderId, receiverId }, config);
            const data = response.data;
            if (data.status === 404 || !data.chat) {
                setMessages([]);
                setChatData(null);
            } else {
                setChatData(data.chat);
                setMessages(data.chat.messages || []);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setSending(true);
        try {
            const token = await getUserData();
            const config = {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post(`${apiUrl}/user/api/v1/message/send`, {
                receiver: receiverId,
                content: inputText.trim(),
                title: chatData?.title,
            },
                config
            );

            const newMessage: Message = {
                messageId: response.data.chat._id,
                content: inputText.trim(),
                sender: {
                    userId: senderId as any,
                    FullName: "You", // Replace if needed
                },
                read: { isRead: false, timeOfRead: null },
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newMessage]);
            setInputText("");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to send message. Try again.");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMyMessage = item.sender.userId !== receiverId;

        return (
            <View
                className={`mb-3 max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${isMyMessage ? "bg-blue-500 ml-auto" : "bg-gray-200"
                    }`}
            >
                <Text className={`${isMyMessage ? "text-white" : "text-gray-900"} text-base`}>
                    {item.content}
                </Text>
                <View className="flex-row justify-end mt-1">
                    <Text className={`text-xs ${isMyMessage ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-500">Loading messages...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-500 mb-4">{error}</Text>
                <TouchableOpacity
                    onPress={fetchMessages}
                    className="bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} className="flex-1 bg-white">
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.messageId}
                contentContainerStyle={{
                    padding: 16,
                    flexGrow: 1,
                    justifyContent: 'flex-end', // 👈 forces messages to grow from bottom
                }}
            />
            <View className="flex-row items-center px-4 py-3 border-t border-gray-200 bg-white">
                <TextInput
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-900"
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    disabled={sending || !inputText.trim()}
                    className={`ml-3 rounded-full p-3 ${sending || !inputText.trim() ? "bg-gray-400" : "bg-blue-500"}`}
                >
                    {sending ? (
                        <ActivityIndicator size={18} color="#fff" />
                    ) : (
                        <Ionicons name="send" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
